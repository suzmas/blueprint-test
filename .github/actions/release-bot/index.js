const core = require('@actions/core');
const github = require('@actions/github');

const todayTagDate = () => {
  const todayYear = new Date().getFullYear();
  const todayMonth = new Date().getMonth() + 1; // .getMonth() returns a zero-based value, so we need to inc by 1

  // tag date should be formatted as YYMM
  const newTagDate = `${todayYear.toString().slice(2)}${todayMonth.toString().padStart(2, '0')}`;
  console.log(newTagDate);
  return newTagDate;
}

const newTagBuild = (shouldReset, lastTagBuild) => {
  const lastBuild = shouldReset ? 0 : parseInt(lastTagBuild) || 0;
  const newTagBuild = (lastBuild + 1).toString().padStart(4, '0');

  return newTagBuild;
}

const makeNewTagName = (lastReleaseTagName) => {
  const tagChunks = lastReleaseTagName.split('.');
    
  const lastTagDate = tagChunks[0];
  const lastTagBuild = parseInt(tagChunks[1]);

  const tagDate = todayTagDate();
  const shouldResetBuild = lastTagDate !== tagDate;
  const tagBuild = newTagBuild(shouldResetBuild, lastTagBuild);

  const newTag = `${tagDate}.${tagBuild}`;

  return newTag;
}

const thething = async (githubToken, owner, repo) => {
  const octokit = github.getOctokit(githubToken);

  // q=repo%3Aadtribute%2Fanalytics%20merged%3A>2021-05-24
  try {
    const lastRelease = await octokit.rest.repos.getLatestRelease({ owner, repo });
    const lastReleaseData = lastRelease.data;

    const prSearchResults = await octokit.rest.search.issuesAndPullRequests({ q: `repo:${owner}/${repo} merged:>${lastReleaseData.created_at} base:master` });
    console.log(prSearchResults.data.items);

    const mergedPulls = prSearchResults.data.items.map(pullData => `${pullData.title}: ${pullData.html_url}`)
    console.log(mergedPulls);

    const newTag = makeNewTagName(lastReleaseData.tag_name);
    console.log('newTag is', newTag);
    
    await octokit.rest.repos.createRelease({ owner, repo, tag_name: newTag });
  } catch (e) {
    console.log(e);
  }
}

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = github.context.payload;
  const githubToken = core.getInput('repo-token');
  const owner = payload.repository.owner.name;
  const repo = payload.repository.name;
  console.log(owner, repo);

  thething(githubToken, owner, repo);
} catch (error) {
  core.setFailed(error.message);
}