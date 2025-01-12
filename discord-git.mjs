import axios from 'axios';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory path of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local file specifically
dotenv.config({ path: join(__dirname, '.env.local') });

const webhookURL = process.env.DISCORD_WEBHOOK_URL_SERVER;

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
    content: `🚀 Deployment successful! The updates are live.\n\n📝 Latest commit:\n> ${commitInfo.message}\n👤 By: ${commitInfo.author}\n\n🔗 Link to docs: https://github.com/elstruck/datax/commit/ \n\n🔗 Link to website: https://winyourdata.com`,
  };

  try {
    if (!webhookURL) {
      throw new Error('Discord webhook URL is not defined');
    }
    await axios.post(webhookURL, message);
    console.log('Notification sent to Discord!');
  } catch (error) {
    console.error('Error sending notification to Discord:', error.message);
  }
};

notify();
