const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

async function run() {
  try {

    const filePath = core.getInput('report_path');

    if(fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath);
      jsonData = JSON.parse(content);
    } else {
      console.log('file not found');
      return;
    }
    
    const annotations = [];

    core.summary.addHeading('Flaky Tests');

    if (jsonData) {
      for (const item of jsonData) {
        core.summary.addDetails(item.title);
      }

      if (annotations.length > 0) {
        const octokit = github.getOctokit(core.getInput('github_token'));

        try {     
          annotations.forEach(element => {
            core.warning(element.title + " is marked as flaky, consider rerunning");
          });
        } catch (error) {
          console.error('API Error:', error.message);
          core.setFailed('Failed to create annotations.');
        }
      } else {
        console.log('No annotations to create.');
      }
    } else {
      console.log(jsonData);
      core.setFailed('No json content available');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();