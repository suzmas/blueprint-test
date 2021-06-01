const core = require("@actions/core");
const github = require("@actions/github");

const getNewDateStamp = () => {
  const todayYear = new Date().getFullYear();
  const todayMonth = new Date().getMonth() + 1; // .getMonth() returns a zero-based value -> inc by 1

  const newDateStamp =
    `${todayYear.toString().slice(2)}` +
    `${todayMonth.toString().padStart(2, "0")}`;

  return newDateStamp;
};

const getNewBuildNumber = (shouldResetBuild, lastBuildNumber) => {
  const lastBuildNum = shouldResetBuild ? 0 : parseInt(lastBuildNumber) || 0;
  const newBuildNum = (lastBuildNum + 1).toString().padStart(4, "0");

  return newBuildNum;
};

/**
 * Version numbers take the form of: YYMM.xxxx
 *   a two digit year, a two digit month, followed by a
 *   zero padded incremented build number, reset as the
 *   date stamp changes
 *
 * Example:
 *   - Release: March 2021 - 5th build this month
 *     Version: 2103.0005
 */
const getNewVersionNumber = (lastVersionNumber) => {
  const [lastDateStamp, lastBuildNumber] = lastVersionNumber.split(".");
  const newDateStamp = getNewDateStamp();

  const shouldResetBuild = lastDateStamp !== newDateStamp;
  const newBuildNumber = getNewBuildNumber(shouldResetBuild, lastBuildNumber);

  const newVersion = `${newDateStamp}.${newBuildNumber}`;
  return newVersion;
};

const getLastReleaseData = async (octokit, owner, repo) => {
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

const createNewRelease = async (
  octokit,
  owner,
  repo,
  lastRelease,
  newReleaseDescription
) => {
  try {
    const newVersion = getNewVersionNumber(lastRelease.tag_name);
    await octokit.rest.repos.createRelease({
      owner,
      repo,
      name: `v${newVersion}`,
      tag_name: newVersion,
      body: newReleaseDescription,
      target_commitish: '68d2792'
    });
  } catch (e) {
    console.log(e);
  }
};

const getReleasedPRs = async (octokit, owner, repo, lastRelease) => {
  // TODO -- deploys take a bit -- we can't assume no PRs have been merged since image was built (i.e. we cannot rely on the lastRelease.timeStamp..thisRelase.timeStamp) -- need to get the timestamp for the passed commit SHA -- then filter based on that
  let summaryOfReleasedPRs = "Unknown";

  try {
    const prSearchResults = await octokit.rest.search.issuesAndPullRequests({
      q: `repo:${owner}/${repo} merged:>${lastRelease.created_at} base:master`,
    });
    console.log(prSearchResults.data.items);

    const clubhouseUrlRegex =
      /(app.clubhouse.io\b\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

    const mergedPRList = prSearchResults.data.items.map((pullData) => {
      let summary = `${pullData.title}: ${pullData.html_url}`;
      const clubhouseLinks = pullData.body.match(clubhouseUrlRegex) || [];
      if (clubhouseLinks.length) {
        summary += `\nRelated Clubhouse stories: ${clubhouseLinks.join(", ")}`;
      }
      return summary;
    });

    summaryOfReleasedPRs = mergedPRList.join("\n\n");
  } catch (e) {
    console.log(e);
  }

  return summaryOfReleasedPRs;
};

async function run() {
  try {
    // Get the JSON webhook payload for the event that triggered the workflow
    const { payload } = github.context;
    const owner = payload.repository.owner.login;
    const repo = payload.repository.name;

    const githubToken = core.getInput("repo-token");
    const octokit = github.getOctokit(githubToken);

    const lastRelease = await getLastReleaseData(octokit, owner, repo);
    const newReleaseDescription = await getReleasedPRs(
      octokit,
      owner,
      repo,
      lastRelease
    );

    await createNewRelease(
      octokit,
      owner,
      repo,
      lastRelease,
      newReleaseDescription
    );
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
