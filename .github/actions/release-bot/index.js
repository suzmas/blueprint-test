const core = require('@actions/core');
const github = require('@actions/github');

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);

  const githubToken = core.getInput('repo-token');
  const octokit = github.getOctokit(githubToken);

  const owner = payload.repository.owner.name;
  const repo = payload.repository.name;
  console.log(owner, repo);
  const closedIssues = octokit.rest.issues.list({
    owner,
    repo,
    state: 'closed',
    labels: ['merged'],
    since: '2021-05-23T22:37:46.261Z'
  });

  console.log(closedIssues);
} catch (error) {
  core.setFailed(error.message);
}