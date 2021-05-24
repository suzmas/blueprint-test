const core = require('@actions/core');
const github = require('@actions/github');

const thething = async (githubToken, owner, repo) => {
  const octokit = github.getOctokit(githubToken);

  const thing = await octokit.rest.repos.listContributors({ owner, repo });
  console.log(thing);
  try {
    const closedIssues = await octokit.rest.pulls.list({
      owner,
      repo,
      state: 'closed',
      labels: ['merged'],
      since: '2021-05-22T22:37:46.261Z'
    });
  
    console.log(closedIssues);
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