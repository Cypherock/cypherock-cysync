import { ManagerApp } from '@cypherock/sdk-app-manager';

import { Spinner } from '~/utils';

const name = 'Joystick Training';

export const trainJoystick = async (app: ManagerApp) => {
  const spinner = await Spinner.create(name);

  try {
    await app.trainJoystick();
    spinner.succeed();
  } catch (error) {
    spinner.fail();
    throw error;
  }
};
