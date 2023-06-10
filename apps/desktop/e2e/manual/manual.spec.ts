import {
  expect,
  test,
  ElectronApplication,
  Page,
  Locator,
} from '@playwright/test';
import { prepElectronApp } from '../__fixtures__/prep';

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
  const upWindow = screen.getByRole('heading', { name: 'Toggle Right' });
  await upWindow.waitFor();
  expect(upWindow).toBeVisible();
  const downWindow = screen.getByRole('heading', { name: 'Toggle Down' });
  await downWindow.waitFor();
  expect(downWindow).toBeVisible();
  const finalWindow = screen.getByRole('img', { name: 'Success Icon' });
  await finalWindow.waitFor();
  expect(finalWindow).toBeVisible();
  const SuccessWindow = screen.getByRole('heading', {
    name: 'Joystick test complete',
  });
  await SuccessWindow.waitFor({ timeout: 3000 });
  expect(SuccessWindow).toBeVisible();
});

test('Tap card screen', async () => {
  await screen
    .getByRole('heading', {
      name: 'Tap any X1 Card below the X1 Vault to test card tapping',
    })
    .waitFor({ timeout: 600000 });
  const tapWindow = screen.getByRole('heading', {
    name: 'X1 Card',
    exact: true,
  });
  await tapWindow.waitFor();
  expect(tapWindow).toBeVisible();
  const cardPairing = screen.getByRole('heading', {
    name: 'Tap X1 Cards one by one below the\nX1 Vault ( ? )',
  });
  await cardPairing.waitFor();
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
  const SuccessWindow = screen.getByRole('heading', {
    name: 'Cypherock X1 is now ready to use',
  });
  await SuccessWindow.waitFor({ timeout: 600000 });
  expect(SuccessWindow).toBeVisible();
});
