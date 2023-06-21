import { expect, test, ElectronApplication, Page } from '@playwright/test';
import { prepElectronApp, toFirstScreen } from '../__helpers__';

let electronApp: ElectronApplication;

let screen: Page;

test.beforeEach(async () => {
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
  expect(title).toBe('Cypherock CySync');
});

test('check first screen', async () => {
  await toFirstScreen(screen);
  const header = screen.getByRole('heading', {
    name: 'Ensure the following before you continue',
  });
  await expect(header).toHaveText(['Ensure the following before you continue']);
  const sidePanelFirst = screen.getByText('Welcome to cySync app');
  await expect(sidePanelFirst).toHaveText(['Welcome to cySync app']);
  const sidePanelSecond = screen.getByRole('heading', {
    name: 'Your Gateway to Self-Sovereignty',
  });
  await expect(sidePanelSecond).toHaveText([
    'Your Gateway to Self-Sovereignty',
  ]);
  const firstBullet = screen.getByRole('heading', {
    name: 'You are present in a safe and secure environment',
  });
  await expect(firstBullet).toHaveText([
    'You are present in a safe and secure environment',
  ]);
  const secondtBullet = screen.getByRole('heading', {
    name: 'You have atleast 10-15 minutes to setup your wallet',
  });
  await expect(secondtBullet).toHaveText([
    'You have atleast 10-15 minutes to setup your wallet',
  ]);
  const thirdBullet = screen.getByRole('heading', {
    name: 'You have an active internet connection',
  });
  await expect(thirdBullet).toHaveText([
    'You have an active internet connection',
  ]);
  const fourthBullet = screen.getByRole('heading', {
    name: 'The tamper-proof seal of the package is intact',
  });
  await expect(fourthBullet).toHaveText([
    'The tamper-proof seal of the package is intact',
  ]);
  const fifthBullet = screen.getByRole('heading', {
    name: 'Cypherock will never ask you for your seed phrase nor will it ever ask you to sign a transaction',
  });
  await expect(fifthBullet).toHaveText([
    'Cypherock will never ask you for your seed phrase nor will it ever ask you to sign a transaction',
  ]);
  const sixthBullet = screen.getByRole('heading', {
    name: 'Cypherock will only email you from cypherock.com. Do not trust any email from any other website domain',
  });
  await expect(sixthBullet).toHaveText([
    'Cypherock will only email you from cypherock.com. Do not trust any email from any other website domain',
  ]);
});

test('check usage screen', async () => {
  await screen.getByRole('button', { name: 'Continue' }).click();
  const sidePanelFirst = screen.getByText('Welcome to cySync app');
  await expect(sidePanelFirst).toHaveText(['Welcome to cySync app']);
  const sidePanelSecond = screen.getByRole('heading', {
    name: 'Your Gateway to Self-Sovereignty',
  });
  await expect(sidePanelSecond).toHaveText([
    'Your Gateway to Self-Sovereignty',
  ]);
  const firstBlock = screen.getByRole('heading', {
    name: 'I am using Cypherock X1 for the first time',
  });
  await expect(firstBlock).toHaveText([
    'I am using Cypherock X1 for the first time',
  ]);
  const secondBlock = screen.getByRole('heading', {
    name: 'I have already used a Cypherock X1',
  });
  await expect(secondBlock).toHaveText(['I have already used a Cypherock X1']);
  const backButton = screen.getByRole('button', { name: 'Back' });
  await expect(backButton).toHaveText(['Back']);
  const helpButton = screen.getByRole('button', { name: 'Help ?' });
  await expect(helpButton).toBeVisible();
});

test('check x1 device usage for first time', async () => {
  await screen.getByRole('button', { name: 'Continue' }).click();
  const continueButton = screen
    .locator('section')
    .filter({
      hasText:
        'I am using Cypherock X1 for the first timeChoose this if you have never used Cyp',
    })
    .getByRole('button', { name: 'Continue' })
    .click();
  expect(continueButton).toBeTruthy();
  const backButton = screen.getByRole('button', { name: 'Back' });
  await expect(backButton).toHaveText(['Back']);
  const helpButton = screen.getByRole('button', { name: 'Help ?' });
  await expect(helpButton).toBeVisible();
  const termsOfUse = screen.getByRole('heading', { name: 'Terms of use' });
  await expect(termsOfUse).toBeVisible();
  const termsOfService = screen.getByRole('heading', {
    name: 'Terms Of Service',
  });
  await expect(termsOfService).toBeVisible();
  const privacyPolicy = screen.getByRole('heading', { name: 'Privacy Policy' });
  await expect(privacyPolicy).toBeVisible();
  const sidePanelFirst = screen.locator('span');
  await expect(sidePanelFirst).toBeVisible();
  const statusBar = screen.locator('.sc-buuUZy > img').first();
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
  await screen.getByRole('button', { name: 'Continue' }).click();
  const continueButton = screen
    .locator('section')
    .filter({
      hasText:
        'I have already used a Cypherock X1Choose this if you want to migrate your wallet',
    })
    .getByRole('button', { name: 'Continue' })
    .click();
  expect(continueButton).toBeTruthy();
  const backButton = screen.getByRole('button', { name: 'Back' });
  await expect(backButton).toHaveText(['Back']);
  const helpButton = screen.getByRole('button', { name: 'Help ?' });
  await expect(helpButton).toBeVisible();
  const termsOfUse = screen.getByRole('heading', { name: 'Terms of use' });
  await expect(termsOfUse).toBeVisible();
  const termsOfService = screen.getByRole('heading', {
    name: 'Terms Of Service',
  });
  await expect(termsOfService).toBeVisible();
  const privacyPolicy = screen.getByRole('heading', { name: 'Privacy Policy' });
  await expect(privacyPolicy).toBeVisible();
  const sidePanelFirst = screen.locator('span');
  await expect(sidePanelFirst).toBeVisible();
  const statusBar = screen.locator('.sc-buuUZy > img').first();
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
