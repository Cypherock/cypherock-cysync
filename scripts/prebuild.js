const path = require('path');
const fs = require('fs');
const semver = require('semver');

const { getReleaseParams, config, execCommand } = require('./helpers');

const CHANNEL_CONFIG = {
  default: {
    BUILD_TYPE: 'debug',
    LOG_LEVEL: 'debug',
    API_CYPHEROCK: 'https://dev-api.cypherock.com',
    ALLOW_PRERELEASE: true,
    SIMULATE_PRODUCTION: false,
  },
  debug: {
    BUILD_TYPE: 'production',
    LOG_LEVEL: 'debug',
    API_CYPHEROCK: 'https://api.cypherock.com',
    ALLOW_PRERELEASE: true,
    SIMULATE_PRODUCTION: false,
  },
  [config.RELEASE_CHANNEL]: {
    BUILD_TYPE: 'production',
    LOG_LEVEL: 'info',
    API_CYPHEROCK: 'https://api.cypherock.com',
    ALLOW_PRERELEASE: false,
    SIMULATE_PRODUCTION: false,
  },
};

const setDesktopAppConfig = async params => {
  const configPath = path.join(params.appPath, 'src', 'config.ts');
  const commitHash = await getCommitHash();

  const configJson = {
    ...(CHANNEL_CONFIG[params.channel] ?? CHANNEL_CONFIG.default),
    BUILD_VERSION: commitHash.slice(0, 7),
    CHANNEL: params.channel,
  };

  let configStr = '{\n';
  configStr += Object.entries(configJson).reduce((str, [key, value]) => {
    const tsValue = typeof value === 'boolean' ? value : `'${value}'`;
    return str + `  ${key}: ${tsValue},\n`;
  }, '');
  configStr += '}';
  fs.writeFileSync(configPath, `export default ${configStr}`);
};

const getCommitHash = () => {
  return execCommand('git log -n 1 --pretty=format:"%H"');
};

const setDesktopAppVersion = async params => {
  const pkgJsonVersion = semver.parse(params.pkgJson.version);
  if (!pkgJsonVersion) {
    throw new Error('Invalid version in package json');
  }

  if (
    !(
      pkgJsonVersion.major === params.version.major &&
      pkgJsonVersion.minor === params.version.minor &&
      pkgJsonVersion.patch === params.version.patch
    )
  ) {
    throw new Error(
      `Version in package.json (${params.pkgJson.version}) and tag ${params.tagName} is different.`,
    );
  }

  params.pkgJson.version = params.version.version;
  if (params.channel !== config.RELEASE_CHANNEL) {
    params.pkgJson.productName = `${params.pkgJson.productName}-${params.channel}`;
  }

  fs.writeFileSync(
    path.join(params.appPath, 'package.json'),
    JSON.stringify(params.pkgJson, undefined, 2),
  );
};

const run = async () => {
  try {
    const params = await getReleaseParams();
    await setDesktopAppConfig(params);
    await setDesktopAppVersion(params);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
