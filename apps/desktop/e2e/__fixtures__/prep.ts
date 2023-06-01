import { findLatestBuild, parseElectronApp } from 'electron-playwright-helpers';
import { _electron as electron } from '@playwright/test';
import { version } from '../../package.json';

export async function prepElectronApp() {
  // find the latest build in the out directory
  const latestBuild = findLatestBuild(`release/${version}`);
  // parse the directory and find paths and other info
  const appInfo = parseElectronApp(latestBuild);
  // set the CI environment variable to true
  process.env.CI = 'e2e';
  const electronApp = await electron.launch({
    args: [appInfo.main],
    executablePath: appInfo.executable,
  });
  electronApp.on('window', async page => {
    const filename = page.url().split('/').pop();
    console.log(`Window opened: ${filename}`);
  });
  return electronApp;
}
