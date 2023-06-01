import { expect, test, ElectronApplication, Page } from '@playwright/test';
import { prepElectronApp } from '../__fixtures__/prep';

let electronApp: ElectronApplication;

test.beforeAll(async () => {
  electronApp = await prepElectronApp();
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

test('check the title of window', async () => {
  const title = await screen.title();
  await screen.screenshot({ path: './screenshots/title.png' });
  expect(title).toBe('Cypherock CySync');
});
