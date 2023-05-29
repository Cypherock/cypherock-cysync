const config = {
  appId: 'com.hodl.cypherock',
  productName: 'Cypherock CySync',
  asar: true,
  directories: {
    output: 'release/${version}',
    buildResources: 'public',
  },
  files: ['dist-electron', 'dist'],
  mac: {
    artifactName: '${productName}_${version}_${platform}.${ext}',
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
    artifactName: '${productName}_${version}_${platform}-${arch}.${ext}',
  },
  linux: {
    // TODO: Add RPM later
    target: ['snap', 'deb'],
    category: 'Utility',
    executableName: 'Cypherock CySync',
    artifactName: '${productName}_${version}_${platform}-${arch}.${ext}',
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
