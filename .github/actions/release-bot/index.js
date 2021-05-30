const core = require("@actions/core");
const github = require("@actions/github");

const todayTagDate = () => {
  const todayYear = new Date().getFullYear();
  const todayMonth = new Date().getMonth() + 1; // .getMonth() returns a zero-based value, so we need to inc by 1

  // tag date should be formatted as YYMM
  const newTagDate = `${todayYear.toString().slice(2)}${todayMonth
    .toString()
    .padStart(2, "0")}`;
  console.log(newTagDate);
  return newTagDate;
};

const newTagBuild = (shouldReset, lastTagBuild) => {
  const lastBuild = shouldReset ? 0 : parseInt(lastTagBuild) || 0;
  const newTagBuild = (lastBuild + 1).toString().padStart(4, "0");

  return newTagBuild;
};

const makeNewTagName = (lastReleaseTagName) => {
  const tagChunks = lastReleaseTagName.split(".");

  const lastTagDate = tagChunks[0];
  const lastTagBuild = parseInt(tagChunks[1]);

  const tagDate = todayTagDate();
  const shouldResetBuild = lastTagDate !== tagDate;
  const tagBuild = newTagBuild(shouldResetBuild, lastTagBuild);

  const newTag = `${tagDate}.${tagBuild}`;

  return newTag;
};

const getLastRelease = async (octokit, owner, repo) => {
  let lastReleaseData;
  try {
    const lastRelease = await octokit.rest.repos.getLatestRelease({
      owner,
      repo,
    });
    lastReleaseData = lastRelease.data;
  } catch (e) {
    console.log(e);
  }
  return lastReleaseData;
};

const createNewRelease = async (octokit, owner, repo, lastRelease) => {
  try {
    const newTag = makeNewTagName(lastRelease.tag_name);
    console.log("newTag is", newTag);
    await octokit.rest.repos.createRelease({ owner, repo, tag_name: newTag });
  } catch (e) {
    console.log(e);
  }
};

const getReleasedPRs = async (octokit, owner, repo, lastReleaseTime) => {
  // TODO -- deploys take a bit -- we can't assume no PRs have been merged since image was built (i.e. we cannot rely on the lastRelease.timeStamp..thisRelase.timeStamp) -- need to get the timestamp for the passed commit SHA -- then filter based on that
  try {
    const prSearchResults = await octokit.rest.search.issuesAndPullRequests({
      q: `repo:${owner}/${repo} merged:>${lastReleaseTime} base:master`,
    });
    console.log(prSearchResults.data.items);

    const clubhouseUrlRegex =
      /(app.clubhouse.io\b\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

    const mergedPulls = prSearchResults.data.items.map((pullData) => {
      const summary = `${pullData.title}: ${pullData.html_url}`;
      const clubhouseLinks = pullData.body.match(clubhouseUrlRegex);
      if (clubhouseLinks.length) {
        summary += `\nRelated Clubhouse stories: ${clubhouseLinks.join(", ")}`;
      }
      return summary;
    });

    console.log(mergedPulls);
  } catch (e) {
    console.log(e);
  }
};


async function run() {
  try {
    const time = new Date().toTimeString();
    core.setOutput("time", time);
  
    // Get the JSON webhook payload for the event that triggered the workflow
    const { payload } = github.context;
    const owner = payload.repository.owner.login;
    const repo = payload.repository.name;
  
    console.log(owner, repo);
  
    const githubToken = core.getInput("repo-token");
    const octokit = github.getOctokit(githubToken);
  
    const lastRelease = await getLastRelease(octokit, owner, repo);
    await createNewRelease(octokit, owner, repo, lastRelease);
    await getReleasedPRs(githubToken, owner, repo, lastRelease.createdAt);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();