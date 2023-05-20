require('dotenv').config();
const { notarize } = require('@electron/notarize');
const config = require('../electron-builder');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    return;
  }

  if (!process.env.APPLE_ID || !process.env.APPLE_ID_PASSWORD) {
    console.log('Notarization credentials not found');
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  console.log('Notarizing app...');
  return await notarize({
    appBundleId: config.appId,
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
  });
};
