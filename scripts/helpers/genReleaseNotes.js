const fs = require('fs');
const path = require('path');
const semver = require('semver');

const config = require('./config');
const getReleaseParams = require('./params');

const run = async () => {
  const args = await getReleaseParams();
  const changeLogPath = path.join(args.appPath, 'CHANGELOG.md');

  const changeLogLines = (await fs.promises.readFile(changeLogPath))
    .toString()
    .split('\n');

  let parsedNotes = '';
  let currentVersion;

  for (const line of changeLogLines) {
    const isVersionLine = line.startsWith('## ');
    const clean = line.replace('## ', '');

    if (isVersionLine) {
      currentVersion = clean;
      if (
        semver.eq(
          clean,
          `${args.version.major}.${args.version.minor}.${args.version.patch}`,
        )
      ) {
        parsedNotes = `${line}`;
      } else {
        currentVersion = null;
      }
    } else {
      if (currentVersion) {
        parsedNotes = `${parsedNotes}\n${line}`;
      }
    }
  }

  fs.writeFileSync(config.RELEASE_NOTES_PATH, parsedNotes);

  return config.RELEASE_NOTES_PATH;
};

module.exports = run;
