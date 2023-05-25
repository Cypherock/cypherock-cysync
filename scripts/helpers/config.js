const path = require('path');

const ROOT_PATH = path.join(__dirname, '..', '..');

const config = {
  ROOT_PATH,
  TAG_NAME: process.env.GITHUB_REF_NAME,
  RELEASE_NOTES_PATH: path.join(ROOT_PATH, 'RELEASE_NOTES.md'),
  S3_URL: process.env.AWS_S3_UPLOAD_URL,
  RELEASE_CHANNEL: 'latest',
};

module.exports = config;
