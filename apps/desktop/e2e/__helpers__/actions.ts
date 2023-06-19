import { Page } from '@playwright/test';

export const toFirstScreen = async (screen: Page) => {
  const hasCheckbox = await screen.$$('text="I have already ran the command"');

  if (hasCheckbox.length > 0) {
    await screen.getByText('I have already ran the command').click();
    await screen.getByRole('button', { name: 'Continue' }).click();
  }
};
