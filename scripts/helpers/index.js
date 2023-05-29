const config = require('./config');
const getReleaseParams = require('./params');
const genReleaseNotes = require('./genReleaseNotes');
const execCommand = require('./exec');

module.exports = {
  config,
  getReleaseParams,
  genReleaseNotes,
  execCommand,
};
