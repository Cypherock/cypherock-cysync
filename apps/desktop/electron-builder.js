const productName = 'Cypherock CySync';
const productNameInArtifact = 'cypherock-cysync';

const getArtifactName = (withoutArch = false) => {
  if (withoutArch) {
    return `${productNameInArtifact}-\${version}-\${platform}.\${ext}`;
  }

  return `${productNameInArtifact}-\${version}-\${platform}-\${arch}.\${ext}`;
};

const config = {
  appId: 'com.hodl.cypherock',
  productName,
  asar: true,
  asarUnpack: ['!**/*.node'],
  directories: {
    output: 'release/${version}',
    buildResources: 'build',
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
    executableName: 'Cypherock CySync',
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
  config.win.signtoolOptions.certificateSubjectName =
    process.env.WINDOWS_CERT_SUBJECT;
}

module.exports = config;
