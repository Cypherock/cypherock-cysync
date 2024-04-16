const path = require('path');
const fs = require('fs');
const semver = require('semver');

const { getReleaseParams, config, execCommand } = require('./helpers');
const channelMigrations = require('../apps/desktop/src/migrations/channel.json');

const betaChannels = ['beta', 'betatest', 'pre'];

const CHANNEL_CONFIG = {
  default: {
    BUILD_TYPE: 'debug',
    LOG_LEVEL: 'debug',
    API_CYPHEROCK: 'https://dev-api.cypherock.com',
    ALLOW_PRERELEASE: true,
    SIMULATE_PRODUCTION: false,
  },
  ...betaChannels.reduce(
    (a, c) => ({
      ...a,
      [c]: {
        BUILD_TYPE: 'production',
        LOG_LEVEL: 'debug',
        API_CYPHEROCK: 'https://api.cypherock.com',
        ALLOW_PRERELEASE: true,
        SIMULATE_PRODUCTION: false,
      },
    }),
    {},
  ),
  [config.RELEASE_CHANNEL]: {
    BUILD_TYPE: 'production',
    LOG_LEVEL: 'info',
    API_CYPHEROCK: 'https://api.cypherock.com',
    ALLOW_PRERELEASE: false,
    SIMULATE_PRODUCTION: false,
  },
};

const getUpdateChannel = () => {
  const channelMigrationItem = channelMigrations.find(
    c => c.from === config.CHANNEL,
  );
  if (!channelMigrationItem) return config.CHANNEL;

  return channelMigrationItem.to;
};

const setDesktopAppVersion = async params => {
  if (config.CHANNEL !== config.RELEASE_CHANNEL) {
    params.pkgJson.productName = `${params.pkgJson.productName}-${config.CHANNEL}`;
  }

  const pkgJsonVersion = semver.parse(params.pkgJson.version);

  if (!pkgJsonVersion) {
    throw new Error('Invalid version in package json');
  }

  if (config.DO_UPDATE_APP_VERSION) {
    console.log('Updating version in package.json...');
    const versionWithoutChannelPostfix = `${params.version.major}.${params.version.minor}.${params.version.patch}-${config.CHANNEL}`;
    const tagNameWithoutChannelPostfix = `${config.APP_NAME}@${versionWithoutChannelPostfix}`;
    let version = versionWithoutChannelPostfix;

    const existingTags = await execCommand(
      `git tag -l "${tagNameWithoutChannelPostfix}.*"`,
    );
    const channelVersions = existingTags
      .trim()
      .split('\n')
      .filter(e => !!e)
      .map(tag =>
        parseInt(tag.replace(`${tagNameWithoutChannelPostfix}.`, ''), 10),
      )
      .sort((a, b) => b - a);

    if (channelVersions.length === 0) {
      version += `.0`;
    } else {
      version += `.${channelVersions[0] + 1}`;
    }

    console.log(`New version: ${version}`);
    params.pkgJson.version = version;
  }

  fs.writeFileSync(
    path.join(params.appPath, 'package.json'),
    JSON.stringify(params.pkgJson, undefined, 2),
  );
};

const setDesktopAppConfig = async params => {
  const configPath = path.join(params.appPath, 'src', 'config.ts');
  const commitHash = await getCommitHash();

  const configJson = {
    ...(CHANNEL_CONFIG[config.CHANNEL] ?? CHANNEL_CONFIG.default),
    BUILD_VERSION: commitHash.slice(0, 7),
    CHANNEL: getUpdateChannel(),
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

const run = async () => {
  try {
    const params = await getReleaseParams();

    await setDesktopAppVersion(params);
    await setDesktopAppConfig(params);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
