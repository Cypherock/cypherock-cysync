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

    if (config.APP_NAME === _appPkgJson.name) {
      appName = _appPkgJson.name;
      appPath = appDirPath;
      appPkgJson = _appPkgJson;
      break;
    }
  }

  if (!appName || !appPath) {
    throw new Error(`Invalid app name for build: ${config.APP_NAME}`);
  }

  const parsedVersion = semver.parse(appPkgJson.version);
  if (!parsedVersion) {
    throw new Error(`Invalid version in package.json: ${appPkgJson.version}`);
  }

  let channel;

  if (parsedVersion.prerelease.length <= 0) {
    channel = config.RELEASE_CHANNEL;
  } else {
    channel = parsedVersion.prerelease[0];
  }

  return {
    version: parsedVersion,
    channel,
    appName,
    appPath,
    pkgJson: appPkgJson,
  };
};

module.exports = getReleaseParams;
