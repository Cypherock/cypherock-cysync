const path = require('path');
const fs = require('fs');
const semver = require('semver');
const childProcess = require('child_process');

const TAG_NAME = process.env.GITHUB_REF_NAME;

const DESKTOP_APP_PACKAGE_NAME = '@cypherock/cysync-desktop';
const DESKTOP_APP_PATH = path.join(__dirname, '..', 'apps', 'desktop');
const DESKTOP_APP_PRODUCT_NAME = 'cypherock-cysync';

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
  latest: {
    BUILD_TYPE: 'production',
    LOG_LEVEL: 'info',
    API_CYPHEROCK: 'https://api.cypherock.com',
    ALLOW_PRERELEASE: false,
    SIMULATE_PRODUCTION: false,
  },
};

const getArgs = () => {
  const name = TAG_NAME;

  if (!name.startsWith(DESKTOP_APP_PACKAGE_NAME)) {
    throw new Error(`Invalid tag for build: ${name}`);
  }
  const version = name.replace(`${DESKTOP_APP_PACKAGE_NAME}@`, '');

  const parsedVersion = semver.parse(version);
  if (!parsedVersion) {
    throw new Error(`Invalid version in tag: ${name}`);
  }

  let channel;

  if (parsedVersion.prerelease.length <= 0) {
    channel = 'latest';
  } else {
    channel = parsedVersion.prerelease[0];
  }

  return { tagName: name, version: parsedVersion, channel };
};

const setConfig = async args => {
  const configPath = path.join(DESKTOP_APP_PATH, 'src', 'config.ts');
  const commitHash = await getCommitHash();

  const configJson = {
    ...(CHANNEL_CONFIG[args.channel] ?? CHANNEL_CONFIG.default),
    BUILD_VERSION: commitHash.slice(0, 7),
    CHANNEL: args.channel,
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
  return new Promise((resolve, reject) => {
    childProcess.exec(
      'git log -n 1 --pretty=format:"%H"',
      (err, stdout, stderr) => {
        if (err || stderr) {
          reject(err || stderr);
          return;
        }

        resolve(stdout.trim());
      },
    );
  });
};

const setVersion = async args => {
  const packageJsonPath = path.join(DESKTOP_APP_PATH, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));

  const pkgJsonVersion = semver.parse(packageJson.version);
  if (!pkgJsonVersion) {
    throw new Error('Invalid version in package json');
  }

  if (
    !(
      pkgJsonVersion.major === args.version.major &&
      pkgJsonVersion.minor === args.version.minor &&
      pkgJsonVersion.patch === args.version.patch
    )
  ) {
    throw new Error(
      `Version in package.json (${packageJson.version}) and tag ${args.tagName} is different.`,
    );
  }

  packageJson.version = args.version.version;
  if (args.channel === 'latest') {
    packageJson.productName = DESKTOP_APP_PRODUCT_NAME;
  } else {
    packageJson.productName = `${DESKTOP_APP_PRODUCT_NAME}-${args.channel}`;
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, undefined, 2));
};

const run = async () => {
  try {
    const args = getArgs();
    await setConfig(args);
    await setVersion(args);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
