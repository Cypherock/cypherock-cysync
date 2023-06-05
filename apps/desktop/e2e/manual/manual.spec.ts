import { expect, test, ElectronApplication, Page } from '@playwright/test';
import { prepElectronApp } from '../__fixtures__/prep';

let electronApp: ElectronApplication;
let screen: Page;

test.beforeEach(async () => {
  electronApp = await prepElectronApp();
  const splash = await electronApp.firstWindow();
  await splash.waitForEvent('close');
  screen = await electronApp.firstWindow();
});

test.afterAll(async () => {
  await electronApp.close();
});

test('record', async () => {
  await screen.pause();
});

test('Device connection screen', async () => {
  const newWindow = screen.getByRole('heading', {
    name: 'Your X1 Vault will now be authenticated through Cypherock to check its authenticity...(?)',
  });
  await newWindow.waitFor();
  expect(newWindow).toBeVisible();
});

test('Device authentication successful', async () => {
  const newWindow = screen.getByRole('heading', {
    name: 'Your X1 Vault is successfully authenticated',
  });
  await newWindow.waitFor();
  expect(newWindow).toBeVisible();
});

test('Device disconnection during device auth', async () => {
  await screen
    .getByRole('heading', {
      name: 'Your X1 Vault will now be authenticated through Cypherock to check its authenticity...(?)',
    })
    .waitFor({ timeout: 300000 });
  const newWindow = screen.getByRole('heading', {
    name: 'Connect your X1 Vault to your PC to proceed',
  });
  await newWindow.waitFor();
  expect(newWindow).toBeVisible();
});

test('Joystick training', async () => {
  await screen
    .getByRole('heading', {
      name: 'X1 Vault provides 4 way joystick for screen navigation',
    })
    .waitFor({ timeout: 300000 });
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
