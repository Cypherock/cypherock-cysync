/**
 * Example Playwright script for Electron
 * showing/testing various API features
 * in both renderer and main processes
 */

import {
  expect,
  test,
  ElectronApplication,
  Page,
  _electron as electron,
} from '@playwright/test';
import { findLatestBuild, parseElectronApp } from 'electron-playwright-helpers';

let electronApp: ElectronApplication;

test.beforeAll(async () => {
  // find the latest build in the out directory
  const latestBuild = findLatestBuild('release/1.0.0');
  // parse the directory and find paths and other info
  const appInfo = parseElectronApp(latestBuild);
  // set the CI environment variable to true
  process.env.CI = 'e2e';
  electronApp = await electron.launch({
    args: [appInfo.main],
    executablePath: appInfo.executable,
  });
  electronApp.on('window', async page => {
    const filename = page.url().split('/').pop();
    console.log(`Window opened: ${filename}`);

    // capture errors
    page.on('pageerror', error => {
      console.error(error);
    });
    // capture console messages
    page.on('console', msg => {
      console.log(msg.text());
    });
  });
});

test.afterAll(async () => {
  await electronApp.close();
});

let page: Page;

// test("record", async () => {
// 	test.setTimeout(300000);
// 	page = await electronApp.firstWindow();
// 	await page.waitForTimeout(5000);
// 	const page2 = await electronApp.windows()
// 	await page2[0].pause();
// 	console.log('pausing..')
// 	await page.pause();
// 	console.log('resuming...')

// });

test('check the title of window', async () => {
  page = await electronApp.firstWindow();
  const title = await page.title();
  expect(title).toBe('Cypherock CySync');
});
