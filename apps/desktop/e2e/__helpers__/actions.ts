import { Page } from '@playwright/test';

export const toFirstScreen = async (screen: Page) => {
  const hasCheckbox = await screen.$$('text="I have already ran the command"');

  if (hasCheckbox.length > 0) {
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
