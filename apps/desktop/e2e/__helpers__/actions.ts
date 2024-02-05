import { Page } from '@playwright/test';

import { removeCysyncDatabase } from './databaseHandler';

const HARD_TIMEOUT_MS = 10000;
const PEEK_TIME_MS = 250;

export const sleep = (ms: number) =>
  // eslint-disable-next-line no-promise-executor-return
  new Promise(resolve => setTimeout(resolve, ms));

export const waitUntil = async (callback: () => Promise<boolean>) => {
  const start = performance.now();
  let current = start;
  while (current - start < HARD_TIMEOUT_MS) {
    if (await callback()) return;
    await sleep(PEEK_TIME_MS);
    current = performance.now();
  }
};

export const toFirstScreen = async (screen: Page) => {
  // CI doesn't seem to work without this
  await sleep(3000);

  // We wait until loader icon is not visible
  await waitUntil(
    async () =>
      !(await screen.getByRole('img', { name: 'Loader Icon' }).isVisible()),
  );

  const hasCheckbox = await screen.getByText('I have already run the command');
  if (await hasCheckbox.isVisible()) {
    await screen.getByText('I have already run the command').click();
    await screen.getByRole('button', { name: 'Continue' }).click();
  }
};

export const clearDb = async () => {
  removeCysyncDatabase();
};
