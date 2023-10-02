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
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();