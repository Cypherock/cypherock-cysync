require('dotenv').config();
const { notarize } = require('@electron/notarize');
const config = require('../electron-builder');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    return;
  }

  if (
    !process.env.APPLE_ID ||
    !process.env.APPLE_ID_PASSWORD ||
    !process.env.APPLE_TEAM_ID
  ) {
    console.log('Notarization credentials not found');
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  console.log('Notarizing app...');
  return await notarize({
    appBundleId: config.appId,
    appPath: `${appOutDir}/${appName}.app`,
    tool: 'notarytool',
    teamId: process.env.APPLE_TEAM_ID,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
  });
};
