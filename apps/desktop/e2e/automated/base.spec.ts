import { expect, test, ElectronApplication, Page } from '@playwright/test';

import { clearDb, prepElectronApp, toFirstScreen } from '../__helpers__';

let electronApp: ElectronApplication;

let screen: Page;

test.beforeEach(async () => {
  await clearDb();
  electronApp = await prepElectronApp();
  const splash = await electronApp.firstWindow();
  await splash.waitForEvent('close');
  screen = await electronApp.firstWindow();
  await toFirstScreen(screen);
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
    name: 'You have at least 10-15 minutes to setup your wallet',
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
  await screen.getByRole('button', { name: 'Continue' }).click();
  await screen
    .locator('section')
    .filter({
      hasText: 'I am using Cypherock X1 for the first time',
    })
    .getByRole('button', { name: 'Continue' })
    .click();
  const sidePanel = screen.getByText('Terms of Use').first();
  const helpButton = screen.getByRole('button', { name: 'Help ?' });
  await expect(helpButton).toBeVisible();
  const firstBlock = screen.getByRole('heading', { name: 'Terms of Use' });
  await expect(firstBlock).toBeVisible();
  await expect(sidePanel).toBeVisible();
  const subText = screen.getByText(
    'Take some time to review our Terms of Service and Privacy Policy',
  );
  await expect(subText).toBeVisible();
  const firstBullet = screen.getByRole('heading', {
    name: 'Terms of Service',
  });
  await expect(firstBullet).toBeVisible();
  const secondBullet = screen.getByRole('heading', { name: 'Privacy Policy' });
  await expect(secondBullet).toBeVisible();
  const backButton = screen.getByRole('button', { name: 'Back' });
  await expect(backButton).toBeVisible();
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
  await screen
    .locator('section')
    .filter({ hasText: 'I have already used a Cypherock X1' })
    .getByRole('button', { name: 'Continue' })
    .click();
  const sidePanel = screen.getByText('Terms of Use').first();
  const helpButton = screen.getByRole('button', { name: 'Help ?' });
  await expect(helpButton).toBeVisible();
  const firstBlock = screen.getByRole('heading', { name: 'Terms of Use' });
  await expect(firstBlock).toBeVisible();
  await expect(sidePanel).toBeVisible();
  const subText = screen.getByText(
    'Take some time to review our Terms of Service and Privacy Policy',
  );
  await expect(subText).toBeVisible();
  const firstBullet = screen.getByRole('heading', {
    name: 'Terms of Service',
  });
  await expect(firstBullet).toBeVisible();
  const secondBullet = screen.getByRole('heading', { name: 'Privacy Policy' });
  await expect(secondBullet).toBeVisible();
  const backButton = screen.getByRole('button', { name: 'Back' });
  await expect(backButton).toBeVisible();
  const confirmButton = screen.getByRole('button', { name: 'Confirm' });
  await expect(confirmButton).toBeDisabled();
  const checkBox = screen
    .getByText('I have read and agree with the Terms of Use and Privacy Policy')
    .click();
  expect(checkBox).toBeTruthy();
  await expect(confirmButton).toBeEnabled();
  await confirmButton.click();
});

test('Check Set Password Screen', async () => {
  await screen.getByRole('button', { name: 'Continue' }).click();
  await screen
    .locator('section')
    .filter({
      hasText: 'I am using Cypherock X1 for the first time',
    })
    .getByRole('button', { name: 'Continue' })
    .click();
  await screen.locator('#terms_accepted').nth(1).click();
  await screen.getByRole('button', { name: 'Confirm' }).click();
  const sidePanel = screen.getByText('Set Password');
  await expect(sidePanel).toBeVisible();
  const helpButton = screen.getByRole('button', { name: 'Help ?' });
  await expect(helpButton).toBeVisible();
  const firstBlock = screen.getByRole('heading', {
    name: 'Set your cySync password',
  });
  await expect(firstBlock).toBeVisible();
  const secondBlock = screen.getByRole('heading', {
    name: 'We do not store your password on our servers',
  });
  await expect(secondBlock).toBeVisible();
  const thirdBlock = screen.getByText('New Password');
  await expect(thirdBlock).toBeVisible();
  const fourthBlock = screen.getByText('Confirm Password');
  await expect(fourthBlock).toBeVisible();
  const fifthBlock = screen.getByText(
    'Use 8 or more characters with a mix of letters, numbers & symbols',
  );
  await expect(fifthBlock).toBeVisible();
  const backButton = screen.getByRole('button', { name: 'Back Back' });
  await backButton.click();
  const termsofUse = screen.getByRole('heading', { name: 'Terms of use' });
  await expect(termsofUse).toBeVisible();
  await screen.getByRole('button', { name: 'Confirm' }).click();
  const passwordInput = screen.locator('input[name="password"]');
  await passwordInput.click();
  await passwordInput.fill('1234TYTabcd$%');
  const passwordConfirm = screen.locator('input[name="confirm password"]');
  await passwordConfirm.click();
  await passwordConfirm.fill('1234TYTabcd$%');
  await screen.getByRole('button', { name: 'Confirm' }).click();
  const confirmBlockFirst = screen.getByRole('img', { name: 'Success Icon' });
  await expect(confirmBlockFirst).toBeVisible({ timeout: 15000 });
  await expect(
    screen.getByRole('heading', {
      name: 'Your cySync password has been successfully set',
    }),
  ).toBeVisible();
  const confirmBlockSecond = screen.getByRole('heading', {
    name: 'Your cySync password has been successfully set',
  });
  await expect(confirmBlockSecond).toBeVisible();
});

test('Check Password Screen errors and skip behaviour', async () => {
  await screen.getByRole('button', { name: 'Continue' }).click();
  await screen
    .locator('section')
    .filter({
      hasText: 'I am using Cypherock X1 for the first time',
    })
    .getByRole('button', { name: 'Continue' })
    .click();
  await screen.locator('#terms_accepted').nth(1).click();
  await screen.getByRole('button', { name: 'Confirm' }).click();
  await screen.getByRole('button', { name: 'Confirm' }).click();
  const noPassword = screen.getByRole('heading', {
    name: 'Password is required',
  });
  await expect(noPassword).toBeVisible();
  await screen.locator('input[name="password"]').click();
  await screen.locator('input[name="password"]').fill('314');
  await screen.getByRole('button', { name: 'Confirm' }).click();
  const minCharacters = screen.getByRole('heading', {
    name: 'Password must be at least 8 characters',
  });
  await expect(minCharacters).toBeVisible();
  await screen.locator('input[name="password"]').click();
  await screen.locator('input[name="password"]').fill('314^&*^&^&*^&*&');
  await screen.getByRole('button', { name: 'Confirm' }).click();
  const upperCase = screen.getByRole('heading', {
    name: 'Password must contain at least 1 uppercase letter',
  });
  await expect(upperCase).toBeVisible();
  await screen.locator('input[name="password"]').fill('314^&*^&^&*^&*&HJGGH');
  await screen.getByRole('button', { name: 'Confirm' }).click();
  const lowerCase = screen.getByRole('heading', {
    name: 'Password must contain at least 1 lowercase letter',
  });
  await expect(lowerCase).toBeVisible();
  await screen.locator('input[name="password"]').click();
  await screen.locator('input[name="password"]').fill('^&*^&^&*^&*&JJghf');
  await screen.getByRole('button', { name: 'Confirm' }).click();

  const numValidation = screen.getByRole('heading', {
    name: 'Password must contain at least 1 number',
  });
  await expect(numValidation).toBeVisible();
  await screen.locator('input[name="password"]').click();
  await screen
    .locator('input[name="password"]')
    .fill('GGFGFsdgjhsdgfshj42367425462');
  await screen.getByRole('button', { name: 'Confirm' }).click();
  const symbolValidation = screen.getByRole('heading', {
    name: 'Password must contain at least 1 symbol',
  });
  await expect(symbolValidation).toBeVisible();
  await screen.locator('input[name="password"]').click();
  await screen
    .locator('input[name="password"]')
    .fill('HGFGDGdgjhsdgfshj42367425462%^%^');
  await screen.getByRole('button', { name: 'Confirm' }).click();
  const passwordMismatch = screen.getByRole('heading', {
    name: 'Passwords do not match',
  });
  await expect(passwordMismatch).toBeVisible();
  await screen.locator('input[name="confirm password"]').click();
  await screen
    .locator('input[name="confirm password"]')
    .fill('gfgfsdgjhsdgfshj42367425462%^%^');
  const skipButton = screen.getByRole('button', { name: 'Skip' });
  await skipButton.click();
  const emailAuth = screen.getByText('Email Auth');
  await expect(emailAuth).toBeVisible();
});

test('Check email-auth screen behaviour', async () => {
  await screen.getByRole('button', { name: 'Continue' }).click();
  await screen
    .locator('section')
    .filter({
      hasText:
        'I am using Cypherock X1 for the first timeChoose this if you have never used Cyp',
    })
    .getByRole('button', { name: 'Continue' })
    .click();
  await screen.locator('#terms_accepted').nth(1).click();
  await screen.getByRole('button', { name: 'Confirm' }).click();
  await screen.getByRole('button', { name: 'Skip' }).click();
  const emailAuth = screen.getByText('Email Auth');
  await expect(emailAuth).toBeVisible();
  const helpButton = screen.getByRole('button', { name: 'Help ?' });
  await expect(helpButton).toBeVisible();
  const emailIcon = screen.getByRole('img', { name: 'Email Icon' });
  await expect(emailIcon).toBeVisible();
  const firstBlock = screen.getByRole('heading', {
    name: 'You are recommended to enter an email ID as a 2FA to get authenticity results',
  });
  await expect(firstBlock).toBeVisible();
  const subText = screen.getByRole('heading', {
    name: 'We do not store this email ID permanently on our servers',
  });
  await expect(subText).toBeVisible();
  const secondBlock = screen.getByText('Email', { exact: true });
  await expect(secondBlock).toBeVisible();
  const placeHolder = screen.getByPlaceholder('Email');
  await expect(placeHolder).toBeVisible();
  const skipButton = screen.getByRole('button', { name: 'Skip' });
  await skipButton.click();
  const deviceConnection = screen.getByText('Device Connection');
  await expect(deviceConnection).toBeVisible();
  const backButton = screen.getByRole('button', { name: 'Back Back' });
  await backButton.click();
  await expect(emailAuth).toBeVisible();
  const continueButton = screen.getByRole('button', { name: 'Continue' });
  await continueButton.click();
  const firstError = screen.getByRole('heading', {
    name: 'This field is required',
  });
  await expect(firstError).toBeVisible();
  await placeHolder.click();
  await placeHolder.fill('cgfcfgc');
  await continueButton.click();
  const secondError = screen.getByRole('heading', {
    name: 'This is not a valid email',
  });
  await expect(secondError).toBeVisible();
  await placeHolder.click();
  await placeHolder.fill('cgfcfgc@.com');
  await continueButton.click();
  await expect(secondError).toBeVisible();
  await placeHolder.click();
  await placeHolder.fill('@gmail.com');
  await continueButton.click();
  await expect(secondError).toBeVisible();
  await placeHolder.click();
  await placeHolder.fill('gaurav.malviya@cypherock.com');
  await continueButton.click();
  await expect(deviceConnection).toBeVisible();
});
