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

const BUILD_RESOURCES_PATH = process.env.VENDOR
  ? 'build/' + process.env.VENDOR
  : 'build/default';

const APP_ID = getAppID();

console.log({ APP_ID });
const config = {
  appId: APP_ID,
  productName,
  asar: true,
  asarUnpack: ['!**/*.node'],
  directories: {
    output: 'release/${version}',
    buildResources: BUILD_RESOURCES_PATH,
  },
  files: [
    'dist-electron',
    'dist',
    '!node_modules/@cypherock/*/src/**',
    '!node_modules/@cypherock/*/.turbo/**',
    '!node_modules/@cypherock/*/scripts/**',
  ],
  extraResources: ['extraResources/RELEASE_NOTES.md'],
  releaseInfo: {
    releaseNotesFile: './extraResources/RELEASE_NOTES.md',
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
    url: 'https://cypherock-updater-v2.s3-accelerate.amazonaws.com/cysync-desktop',
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
