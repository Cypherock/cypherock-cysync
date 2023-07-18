import { ManagerApp } from '@cypherock/sdk-app-manager';

import { Spinner } from '~/utils';

const name = 'Authenticating Device';

export const authDevice = async (app: ManagerApp) => {
  const spinner = await Spinner.create(name);

  try {
    await app.authDevice();
    spinner.succeed();
  } catch (error) {
    spinner.fail();
    throw error;
  }
};
