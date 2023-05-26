const path = require('path');

const ROOT_PATH = path.join(__dirname, '..', '..');

const config = {
  ROOT_PATH,
  APP_NAME: process.env.APP_NAME,
  RELEASE_NOTES_PATH: path.join(ROOT_PATH, 'RELEASE_NOTES.md'),
  S3_URL: process.env.AWS_S3_UPLOAD_URL,
  RELEASE_CHANNEL: 'latest',
};

module.exports = config;
