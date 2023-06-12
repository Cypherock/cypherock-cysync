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

test.afterEach(async () => {
  await electronApp.close();
});

test('record', async () => {
  const splash = await electronApp.firstWindow();
  await splash.pause();
});

test('check the title of window', async () => {
  const title = await screen.title();
  await screen.screenshot({ path: './screenshots/title.png' });
  expect(title).toBe('Cypherock CySync');
});

test('check first screen', async () => {
  const header = screen.getByRole('heading', {
    name: 'Ensure the following before you continue',
  });
  await expect(header).toHaveText(['Ensure the following before you continue']);
  const sidePanelFirst = screen.getByText('Welcome to CySync App');
  await expect(sidePanelFirst).toHaveText(['Welcome to CySync App']);
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
    name: 'You have atleast 15-30 minutes to setup your wallet',
  });
  await expect(secondtBullet).toHaveText([
    'You have atleast 15-30 minutes to setup your wallet',
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
  const sidePanelFirst = screen.getByText('Welcome to CySync App');
  await expect(sidePanelFirst).toHaveText(['Welcome to CySync App']);
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
