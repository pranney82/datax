const axios = require('axios');
const { execSync } = require('child_process');

const webhookURL = 'https://discord.com/api/webhooks/1310829737119060041/Xurf4fvJDxPxd5PmyN9nxK0_OsSpa_L_eAc_015GRq9OGhvkvlQanuR7tQo0i7KiD4ce';

const getLastCommitMessage = () => {
  try {
    // Get the last commit message
    const commitMessage = execSync('git log -1 --pretty=%B').toString().trim();
    // Get the commit author
    const commitAuthor = execSync('git log -1 --pretty=%an').toString().trim();
    return { message: commitMessage, author: commitAuthor };
  } catch (error) {
    console.error('Error getting commit info:', error.message);
    return { message: 'Unable to fetch commit message', author: 'Unknown' };
  }
};

const notify = async () => {
  const commitInfo = getLastCommitMessage();
  
  const message = {
    username: 'Server Bot',
    content: `🚀 Deployment successful! The updates are live.\n\n📝 Latest commit:\n> ${commitInfo.message}\n👤 By: ${commitInfo.author}`,
  };

  try {
    await axios.post(webhookURL, message);
    console.log('Notification sent to Discord!');
  } catch (error) {
    console.error('Error sending notification to Discord:', error.message);
  }
};

notify();
