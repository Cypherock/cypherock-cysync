import { ManagerApp } from '@cypherock/sdk-app-manager';

import { Spinner } from '~/utils';

const name = 'Card Training';

export const trainCard = async (app: ManagerApp) => {
  const spinner = await Spinner.create(name);

  try {
    const result = await app.trainCard({
      onWallets: () => Promise.resolve(true),
    });
    spinner.succeed();

    return result;
  } catch (error) {
    spinner.fail();
    throw error;
  }
};
