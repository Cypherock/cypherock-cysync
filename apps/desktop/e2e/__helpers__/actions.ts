import { Page } from '@playwright/test';

export function sleep(ms: number) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const toFirstScreen = async (screen: Page) => {
  // CI can be slow so we need to wait before we can grab the locator
  sleep(3000);
  const hasCheckbox = await screen.getByText('I have already ran the command');
  if (await hasCheckbox.isVisible()) {
    await screen.getByText('I have already ran the command').click();
    await screen.getByRole('button', { name: 'Continue' }).click();
  }
};

const clearDatabase = async (screen: Page, dbName: string) => {
  const dbHandle = await screen.evaluateHandle(
    `window.electronAPI.get${dbName}()`,
  );
  await screen.evaluateHandle((db: any) => db.clear(), dbHandle);
};

export const clearKeyDb = async (screen: Page) => {
  clearDatabase(screen, 'KeyDb');
};

export const clearDb = async (screen: Page) => {
  clearDatabase(screen, 'Db');
};
