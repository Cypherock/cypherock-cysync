import { expect, test, ElectronApplication, Page } from '@playwright/test';

import { clearKeyDb, prepElectronApp, toFirstScreen } from '../__helpers__';

let electronApp: ElectronApplication;

let screen: Page;

test.beforeEach(async () => {
  await clearKeyDb();
  electronApp = await prepElectronApp();
  const splash = await electronApp.firstWindow();
  await splash.waitForEvent('close');
  screen = await electronApp.firstWindow();
});

test.afterEach(async () => {
  await electronApp.close();
});

test('check the title of window', async () => {
  const title = await screen.title();
  await screen.screenshot({ path: './screenshots/title.png' });
  expect(title).toBe('Cypherock cySync');
});

test('check first screen', async () => {
  await toFirstScreen(screen);
  const header = screen.getByRole('heading', {
    name: 'Ensure the following before you continue',
  });
  await header.waitFor();
  await expect(header).toHaveText(['Ensure the following before you continue']);
  const sidePanelFirst = screen.getByText('Welcome to cySync app');
  await expect(sidePanelFirst).toBeVisible();
  const sidePanelSecond = screen.getByRole('heading', {
    name: 'Your Gateway to Self-Sovereignty',
  });
  await expect(sidePanelSecond).toBeVisible();
  const firstBullet = screen.getByRole('heading', {
    name: 'You are present in a safe and secure environment',
  });
  await expect(firstBullet).toBeVisible();
  const secondBullet = screen.getByRole('heading', {
    name: 'You have atleast 10-15 minutes to setup your wallet',
  });
  await expect(secondBullet).toBeVisible();
  const thirdBullet = screen.getByRole('heading', {
    name: 'You have an active internet connection',
  });
  await expect(thirdBullet).toBeVisible();
  const fourthBullet = screen.getByRole('heading', {
    name: 'The tamper-proof seal of the package is intact',
  });
  await expect(fourthBullet).toBeVisible();
  const fifthBullet = screen.getByRole('heading', {
    name: 'Cypherock will never ask you for your seed phrase nor will it ever ask you to sign a transaction',
  });
  await expect(fifthBullet).toBeVisible();
  const sixthBullet = screen.getByRole('heading', {
    name: 'Cypherock will only email you from cypherock.com. Do not trust any email from any other website domain',
  });
  await expect(sixthBullet).toBeVisible();
});

test('check usage screen', async () => {
  await toFirstScreen(screen);
  await screen.getByRole('button', { name: 'Continue' }).click();
  const sidePanelFirst = screen.getByText('Welcome to cySync app');
  await expect(sidePanelFirst).toBeVisible();
  const sidePanelSecond = screen.getByRole('heading', {
    name: 'Your Gateway to Self-Sovereignty',
  });
  await expect(sidePanelSecond).toBeVisible();
  const firstBlock = screen.getByRole('heading', {
    name: 'I am using Cypherock X1 for the first time',
  });
  await expect(firstBlock).toBeVisible();
  const secondBlock = screen.getByRole('heading', {
    name: 'I have already used a Cypherock X1',
  });
  await expect(secondBlock).toBeVisible();
  const backButton = screen.getByRole('button', { name: 'Back' });
  await expect(backButton).toBeVisible();
  const helpButton = screen.getByRole('button', { name: 'Help ?' });
  await expect(helpButton).toBeVisible();
});

test('check x1 device usage for first time', async () => {
  await toFirstScreen(screen);
  await screen.getByRole('button', { name: 'Continue' }).click();
  await screen
    .locator('section')
    .filter({
      hasText:
        'I am using Cypherock X1 for the first timeChoose this if you have never used Cypherock X1 before',
    })
    .getByRole('button', { name: 'Continue' })
    .click();
  const backButton = screen.getByRole('button', { name: 'Back' });
  await expect(backButton).toBeVisible();
  const helpButton = screen.getByRole('button', { name: 'Help ?' });
  await expect(helpButton).toBeVisible();
  const termsofUse = screen.getByRole('heading', { name: 'Terms of use' });
  await expect(termsofUse).toBeVisible();
  const termsofService = screen.getByRole('heading', {
    name: 'Terms of Service',
  });
  await expect(termsofService).toBeVisible();
  const privacyPolicy = screen.getByRole('heading', { name: 'Privacy Policy' });
  await expect(privacyPolicy).toBeVisible();
  const sidePanelFirst = screen
    .locator('span')
    .filter({ hasText: 'Terms of use' });
  await expect(sidePanelFirst).toBeVisible();
  const statusBar = screen.locator('.sc-erJYPI > img').first();
  await expect(statusBar).toBeVisible();
  const confirmButton = screen.getByRole('button', { name: 'Confirm' });
  await expect(confirmButton).toBeDisabled();
  const checkBox = screen
    .getByText('I have read and agree with the Terms of Use and Privacy Policy')
    .click();
  expect(checkBox).toBeTruthy();
  await expect(confirmButton).toBeEnabled();
  await confirmButton.click();
});

test('check x1 device have been already used before', async () => {
  await toFirstScreen(screen);
  await screen.getByRole('button', { name: 'Continue' }).click();
  await screen
    .locator('section')
    .filter({ hasText: 'I have already used a Cypherock X1' })
    .getByRole('button', { name: 'Continue' })
    .click();
  const backButton = screen.getByRole('button', { name: 'Back' });
  await expect(backButton).toBeVisible();
  const helpButton = screen.getByRole('button', { name: 'Help ?' });
  await expect(helpButton).toBeVisible();
  const termsofUse = screen.getByRole('heading', { name: 'Terms of use' });
  await expect(termsofUse).toBeVisible();
  const termsofService = screen.getByRole('heading', {
    name: 'Terms of Service',
  });
  await expect(termsofService).toBeVisible();
  const privacyPolicy = screen.getByRole('heading', { name: 'Privacy Policy' });
  await expect(privacyPolicy).toBeVisible();
  const sidePanelFirst = screen
    .locator('span')
    .filter({ hasText: 'Terms of use' });
  await expect(sidePanelFirst).toBeVisible();
  const statusBar = screen.locator('.sc-erJYPI > img').first();
  await expect(statusBar).toBeVisible();
  const confirmButton = screen.getByRole('button', { name: 'Confirm' });
  await expect(confirmButton).toBeDisabled();
  const checkBox = screen
    .getByText('I have read and agree with the Terms of Use and Privacy Policy')
    .click();
  expect(checkBox).toBeTruthy();
  await expect(confirmButton).toBeEnabled();
  await confirmButton.click();
});
