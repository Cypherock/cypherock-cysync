import { expect, test, ElectronApplication } from '@playwright/test';
import { prepElectronApp } from '../__helpers__/prep';

let electronApp: ElectronApplication;

test.beforeEach(async () => {
  electronApp = await prepElectronApp();
});

test.afterAll(async () => {
  await electronApp.close();
});

test('Splash screen test', async () => {
  const splashScreen = await electronApp.firstWindow();
  const title = splashScreen.getByText('Welcome to CySync app');
  await expect(title).toHaveText(['Welcome to CySync app']);
  const subTitle = splashScreen.getByText('Your Gateway to Self-Sovereignty');
  await expect(subTitle).toHaveText(['Your Gateway to Self-Sovereignty']);
});
