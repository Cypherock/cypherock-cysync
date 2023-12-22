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
  directories: {
    output: 'release/${version}',
    buildResources: 'build',
  },
  files: ['dist-electron', 'dist'],
  extraResources: ['extraResources/RELEASE_NOTES.md'],
  releaseInfo: {
    releaseNotesFile: './extraResources/RELEASE_NOTES.md',
  },
  mac: {
    artifactName: getArtifactName(),
    entitlements: 'entitlements.plist',
    entitlementsInherit: 'entitlements.plist',
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
    url: 'https://updater.cypherock.com/cysync-desktop',
  },
};

if (process.env.WINDOWS_PFX_FILE && process.env.WINDOWS_PFX_PASSWORD) {
  config.win.certificateFile = process.env.WINDOWS_PFX_FILE;
  config.win.certificatePassword = process.env.WINDOWS_PFX_PASSWORD;
}

module.exports = config;
