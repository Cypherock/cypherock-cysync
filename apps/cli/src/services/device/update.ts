import { ManagerApp } from '@cypherock/sdk-app-manager';

import config from '~/config';
import { connectDevice, createConnection, getDevices, Spinner } from '~/utils';

const name = 'Updating Device Firmware';

export const updateFirmwareAndGetApp = async (app: ManagerApp) => {
  const spinner = await Spinner.create(name);

  try {
    await app.updateFirmware({
      getDevices,
      createConnection: connectDevice,
      onProgress: p => spinner.updateText(`${name} (${p.toFixed(0)}%)`),
      allowPrerelease: config.ALLOW_PRERELEASE,
    });

    spinner.succeed(name);

    const connection = await createConnection();
    return ManagerApp.create(connection);
  } catch (error) {
    spinner.fail();
    throw error;
  }
};
