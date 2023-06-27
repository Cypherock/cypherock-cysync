import {
  expect,
  test,
  ElectronApplication,
  Page,
  Locator,
} from '@playwright/test';
import { prepElectronApp } from '../__helpers__';

let electronApp: ElectronApplication;
let screen: Page;

function sleep(ms: number) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise(resolve => setTimeout(resolve, ms));
}

const waitForAttribute = async (
  locator: Locator,
  name: string,
  value: string,
) => {
  while ((await locator.getAttribute(name)) !== value) {
    await sleep(200);
  }
};

test.beforeEach(async () => {
  electronApp = await prepElectronApp();
  const splash = await electronApp.firstWindow();
  await splash.waitForEvent('close');
  screen = await electronApp.firstWindow();
});

test.afterAll(async () => {
  await electronApp.close();
});

test('Device connection screen', async () => {
  await screen.getByRole('button', { name: 'Continue' }).click();
  await screen
    .locator('section')
    .filter({
      hasText:
        'I am using Cypherock X1 for the first timeChoose this if you have never used Cypherock X1 before',
    })
    .getByRole('button', { name: 'Continue' })
    .click();
  await screen.locator('#terms_accepted').nth(1).click();
  await screen.getByRole('button', { name: 'Confirm' }).click();
  const sidePanelFirst = screen
    .locator('span')
    .filter({ hasText: 'Device Connection' });
  await expect(sidePanelFirst).toBeVisible();
  const backButton = screen.getByRole('button', { name: 'Back' });
  await expect(backButton).toBeVisible();
  const helpButton = screen.getByRole('button', { name: 'Help ?' });
  await expect(helpButton).toBeVisible();
  const disconnectedWindow = screen.getByRole('heading', {
    name: 'Connect your X1 Vault to your PC to proceed',
  });
  await expect(disconnectedWindow).toBeVisible();
  await expect(
    screen.getByRole('heading', {
      name: 'Your X1 Vault will now be authenticated through Cypherock server to check its authenticity (?)',
    }),
  ).toBeVisible();
});

test('Device authentication successful', async () => {
  await screen.getByRole('button', { name: 'Continue' }).click();
  await screen
    .locator('section')
    .filter({
      hasText:
        'I am using Cypherock X1 for the first timeChoose this if you have never used Cypherock X1 before',
    })
    .getByRole('button', { name: 'Continue' })
    .click();
  await screen.locator('#terms_accepted').nth(1).click();
  await screen.getByRole('button', { name: 'Confirm' }).click();
  await screen.getByRole('heading', {
    name: 'Your X1 Vault will now be authenticated through Cypherock server to check its authenticity (?)',
  });
  const helpButton = screen.getByRole('button', { name: 'Help ?' });
  await expect(helpButton).toBeVisible();
  const sidePanelFirst = screen
    .locator('span')
    .filter({ hasText: 'Device Authentication' });
  await expect(sidePanelFirst).toBeVisible();
  const newWindow = screen.getByRole('heading', {
    name: 'Your X1 Vault is successfully authenticated',
  });
  expect(newWindow).toBeVisible();
  await expect(sidePanelFirst).toBeVisible();
  await expect(helpButton).toBeVisible();
});

test('Device disconnection during device auth', async () => {
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
  await screen
    .getByRole('heading', {
      name: 'Your X1 Vault will now be authenticated through Cypherock server to check its authenticity (?)',
    })
    .waitFor({ timeout: 300000 });
  const newWindow = screen.getByRole('heading', {
    name: 'Connect your X1 Vault to your PC to proceed',
  });
  expect(newWindow).toBeVisible();
  const sidePanelFirst = screen
    .locator('span')
    .filter({ hasText: 'Device Authentication' });
  await expect(sidePanelFirst).toBeVisible();
});

test('Joystick Instructions', async () => {
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
  await screen
    .getByRole('heading', {
      name: 'Your X1 Vault will now be authenticated through Cypherock server to check its authenticity (?)',
    })
    .waitFor({ timeout: 300000 });
  const newWindow = screen.getByRole('heading', {
    name: 'X1 Vault provides 4 way joystick for screen navigation',
  });
  expect(newWindow).toBeVisible();
  const helpButton = screen.getByRole('button', { name: 'Help ?' });
  await expect(helpButton).toBeVisible();
  const upWindow = screen.getByRole('heading', { name: 'Toggle Up' });
  expect(upWindow).toBeVisible();
  const rightWindow = screen.getByRole('heading', { name: 'Toggle Right' });
  expect(rightWindow).toBeVisible();
  await expect(helpButton).toBeVisible();
  const downWindow = screen.getByRole('heading', { name: 'Toggle Down' });
  expect(downWindow).toBeVisible();
  await expect(helpButton).toBeVisible();
  const finalWindow = screen.getByRole('img', { name: 'Success Icon' });
  expect(finalWindow).toBeVisible();
  await expect(helpButton).toBeVisible();
  const successWindow = screen.getByRole('heading', {
    name: 'Joystick instructions complete',
  });
  expect(successWindow).toBeVisible({ timeout: 3000 });
});

test('Tap card screen', async () => {
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
  const tapCard = screen.getByRole('heading', {
    name: 'Tap any X1 Card below the X1 Vault to test card tapping',
  });
  expect(tapCard).toBeVisible();
  const sidePanelFirst = screen
    .locator('span')
    .filter({ hasText: 'Card Tapping Instructions' });
  await expect(sidePanelFirst).toBeVisible();
  const helpButton = screen.getByRole('button', { name: 'Help ?' });
  await expect(helpButton).toBeVisible();
  const tapWindow = screen.getByRole('heading', {
    name: 'X1 Card',
    exact: true,
  });
  expect(tapWindow).toBeVisible();
  const cardPairing = screen.getByRole('heading', {
    name: 'Tap X1 Cards one by one below the\nX1 Vault ( ? )',
  });
  const backButton = screen.getByRole('button', { name: 'Back' });
  await expect(backButton).toBeVisible();
  await expect(helpButton).toBeVisible();
  expect(cardPairing).toBeVisible();
  for (let cardNo = 1; cardNo <= 4; cardNo += 1) {
    const cardExp = new RegExp(`^X1 Card #${cardNo}$`);
    for (let cardTap = 0; cardTap <= 2; cardTap += 1) {
      // eslint-disable-next-line no-continue
      if (cardNo === 4 && cardTap === 2) continue;
      const indicator = screen
        .locator('div')
        .filter({ hasText: cardExp })
        .locator('div')
        .nth(cardTap);
      await waitForAttribute(indicator, 'state', 'success');
      expect(indicator).toHaveCSS('background', /^rgb\(81, 198, 26\)/);
    }
  }
  const successWindow = screen.getByRole('heading', {
    name: 'Cypherock X1 is now ready to use',
  });
  await expect(successWindow).toBeVisible();
});
