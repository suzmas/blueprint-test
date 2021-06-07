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
    });
  } catch (e) {
    console.log(e);
  }
};

const getMergedPRs = async (octokit, owner, repo, lastRelease, newReleaseSHA) => {
  let mergedPRs = [];

  try {
    console.log(newReleaseSHA);
    const finalCommitInNewRelease = await octokit.rest.repos.getCommit({
      owner,
      repo,
      ref: newReleaseSHA
    });
  
    const newReleaseTime = finalCommitInNewRelease.data.commit.committer.date;
    const lastReleaseTime = lastRelease.created_at;
  
    const prSearchResults = await octokit.rest.search.issuesAndPullRequests({
      q: `repo:${owner}/${repo} merged:${lastReleaseTime}..${newReleaseTime} base:master`,
    });
    console.log(prSearchResults);

    mergedPRs = prSearchResults.data.items;
  } catch (e) {
    console.log(e);
  }

  return mergedPRs;
}

const extractClubhouseLinks = (prBody) => {
  const clubRegex = /(https:\/\/app.clubhouse.io\b\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
  const clubhouseLinks = prBody.match(clubRegex) || [];
  return clubhouseLinks;
}

const getReleaseSummary = (mergedPRs) => {
  const header = '# Release Changelog\n'
  let summaryOfReleasedPRs = '_Unknown_';

  try {
    const mergedPRList = mergedPRs.data.items.map((pullData) => {
      let summary = `- ${pullData.title}: ${pullData.html_url}`;
      const clubhouseLinks = extractClubhouseLinks(pullData.body);
      if (clubhouseLinks.length) {
        summary += `\n  - Related Clubhouse stories:`
        clubhouseLinks.forEach(link => {
          summary += `\n    - ${link}`
        })
      }
      return summary;
    });

    summaryOfReleasedPRs = mergedPRList.join("\n\n");
  } catch (e) {
    console.log(e);
  }

  console.log(header + summaryOfReleasedPRs);
  return header + summaryOfReleasedPRs;
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
    const newReleaseSHA = core.getInput("target-commit-sha");

    const releasedPRs = await getMergedPRs(octokit, owner, repo, lastRelease, newReleaseSHA);
    const newReleaseDescription = getReleaseSummary(releasedPRs);

    await createNewRelease(
      octokit,
      owner,
      repo,
      lastRelease,
      newReleaseDescription,
      newReleaseSHA
    );
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
