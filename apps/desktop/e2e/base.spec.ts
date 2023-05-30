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

let screen: Page;

test.beforeEach(async () => {
  const splash = await electronApp.firstWindow();
  await splash.waitForEvent('close');
  screen = await electronApp.firstWindow();
});

test('record', async () => {
  await screen.pause();
});

test('check the title of window', async () => {
  const title = await screen.title();
  expect(title).toBe('Cypherock CySync');
});

test('Device connection screen', async () => {
  const newwindow = screen.getByRole('heading', {
    name: 'Your X1 Vault will now be authenticated through Cypherock to check its authenticity...(?)',
  });
  await newwindow.waitFor();
  expect(newwindow).toBeVisible();
});

test('Device authentication successful', async () => {
  const newwindow = screen.getByRole('heading', {
    name: 'Your X1 Vault is successfully authenticated',
  });
  await newwindow.waitFor();
  expect(newwindow).toBeVisible();
});

test('Joystick training', async () => {
  test.setTimeout(12000000);
  await screen
    .getByRole('heading', {
      name: 'X1 Vault provides 4 way joystick for screen navigation',
    })
    .waitFor();
  const upwindow = screen.getByRole('heading', { name: 'Toggle Right' });
  await upwindow.waitFor();
  expect(upwindow).toBeVisible();
  const downwindow = screen.getByRole('heading', { name: 'Toggle Down' });
  await downwindow.waitFor();
  expect(downwindow).toBeVisible();
  const finalwindow = screen.getByRole('img', { name: 'Success Icon' });
  await finalwindow.waitFor();
  expect(finalwindow).toBeVisible();
});
