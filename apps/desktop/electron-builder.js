const pkg = require('./package.json');

const productName = pkg.productName;
const productNameInArtifact = pkg.productName.toLowerCase().replace(' ', '-');

const getArtifactName = (withoutArch = false) => {
  if (withoutArch) {
    return `${productNameInArtifact}-\${version}-\${platform}.\${ext}`;
  }

  return `${productNameInArtifact}-\${version}-\${platform}-\${arch}.\${ext}`;
};

function getAppID() {
  const vendor = process.env.VENDOR;
  switch (vendor) {
    case 'odix':
      return 'com.odix.odixpay';
    default:
      return 'com.hodl.cypherock';
  }
}

function getBuildResourcesPath() {
  if (!process.env.VENDOR) {
    return 'build/default';
  } else {
    return `build/${process.env.VENDOR}`;
  }
}

function getExtraResourcesPath() {
  if (!process.env.VENDOR) {
    return 'extraResources/default';
  } else {
    return `extraResources/${process.env.VENDOR}`;
  }
}

function getPublishUrl() {
  const vendor = process.env.VENDOR;
  switch (vendor) {
    case 'odix':
      return 'https://cypherock-updater-v2.s3-accelerate.amazonaws.com/odix-desktop';
    default:
      return 'https://cypherock-updater-v2.s3-accelerate.amazonaws.com/cysync-desktop';
  }
}

const config = {
  appId: getAppID(),
  productName,
  asar: true,
  asarUnpack: ['!**/*.node'],
  directories: {
    output: 'release/${version}',
    buildResources: getBuildResourcesPath(),
  },
  files: [
    'dist-electron',
    'dist',
    '!node_modules/@cypherock/*/src/**',
    '!node_modules/@cypherock/*/.turbo/**',
    '!node_modules/@cypherock/*/scripts/**',
  ],
  extraResources: [`${getExtraResourcesPath()}/RELEASE_NOTES.md`],
  releaseInfo: {
    releaseNotesFile: `./${getExtraResourcesPath()}/RELEASE_NOTES.md`,
  },
  mac: {
    artifactName: getArtifactName(),
    entitlements: 'entitlements.plist',
    entitlementsInherit: 'entitlements.plist',
    mergeASARs: false,
    target: [
      {
        target: 'dmg',
        arch: ['universal'],
      },
      {
        target: 'zip',
        arch: ['universal'],
      },
    ],
    notarize: false,
  },
  dmg: {
    writeUpdateInfo: false,
  },
  win: {
    target: [
      {
        target: 'nsis',
        arch: ['x64'],
      },
    ],
    artifactName: getArtifactName(),
  },
  linux: {
    target: ['AppImage'],
    category: 'Utility',
    executableName: productName,
    artifactName: getArtifactName(),
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    deleteAppDataOnUninstall: false,
  },
  afterSign: 'scripts/notarize.js',
  publish: {
    provider: 'generic',
    url: getPublishUrl(),
  },
};

if (process.env.WINDOWS_CERT_SUBJECT) {
  if (!config.win.signtoolOptions) {
    config.win.signtoolOptions = {};
  }
  config.win.signtoolOptions.certificateSubjectName =
    process.env.WINDOWS_CERT_SUBJECT;
}

module.exports = config;
