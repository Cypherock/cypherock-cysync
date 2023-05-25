const path = require('path');
const fs = require('fs');
const semver = require('semver');
const config = require('./config');

const getReleaseParams = async () => {
  const appsPath = path.join(config.ROOT_PATH, 'apps');
  const appsDirList = await fs.promises.readdir(appsPath);

  let appName;
  let appPath;
  let appPkgJson;

  for (const appDir of appsDirList) {
    const appDirPath = path.join(appsPath, appDir);

    if (!(await fs.promises.stat(appDirPath)).isDirectory()) continue;

    const _appPkgJson = JSON.parse(
      await fs.promises.readFile(path.join(appDirPath, 'package.json')),
    );

    if (config.TAG_NAME.startsWith(_appPkgJson.name)) {
      appName = _appPkgJson.name;
      appPath = appDirPath;
      appPkgJson = _appPkgJson;
      break;
    }
  }

  if (!appName || !appPath) {
    throw new Error(`Invalid tag for build: ${config.TAG_NAME}`);
  }

  if (appName !== '@cypherock/cysync-desktop') {
    throw new Error(
      `This script is not configured for the given app: ${config.TAG_NAME}`,
    );
  }

  const version = config.TAG_NAME.replace(`${appName}@`, '');

  const parsedVersion = semver.parse(version);
  if (!parsedVersion) {
    throw new Error(`Invalid version in tag: ${config.TAG_NAME}`);
  }

  let channel;

  if (parsedVersion.prerelease.length <= 0) {
    channel = config.RELEASE_CHANNEL;
  } else {
    channel = parsedVersion.prerelease[0];
  }

  return {
    tagName: config.TAG_NAME,
    version: parsedVersion,
    channel,
    appName,
    appPath,
    pkgJson: appPkgJson,
  };
};

module.exports = getReleaseParams;
