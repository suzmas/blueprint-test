const core = require('@actions/core');
const github = require('@actions/github');

const thething = async (githubToken, owner, repo) => {
  const octokit = github.getOctokit(githubToken);

  const closedIssues = await octokit.rest.issues.list({
    owner,
    repo,
    state: 'closed',
    labels: ['merged'],
    since: '2021-05-23T22:37:46.261Z'
  });

  console.log(closedIssues);
}
try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)

  const githubToken = core.getInput('repo-token');
  thething(githubToken, owner, repo);


  const owner = github.context.payload.repository.owner.name;
  const repo = github.context.payload.repository.name;
  console.log(owner, repo);
  console.log(github.context.payload.repository);

} catch (error) {
  core.setFailed(error.message);
}