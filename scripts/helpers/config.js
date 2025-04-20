const path = require('path');

const ROOT_PATH = path.join(__dirname, '..', '..');

const config = {
  ROOT_PATH,
  APP_NAME: process.env.APP_NAME,
  CHANNEL: process.env.CHANNEL,
  CYPHEROCK_API: process.env.API,
  DO_UPDATE_APP_VERSION: process.env.DO_UPDATE_APP_VERSION === 'true',
  RELEASE_NOTES_PATH: path.join(ROOT_PATH, 'RELEASE_NOTES.md'),
  S3_URL: process.env.AWS_S3_UPLOAD_URL,
  VENDOR: process.env.VENDOR ?? 'default',
  RELEASE_CHANNEL: 'latest',
};

module.exports = config;
