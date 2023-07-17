// eslint-disable-next-line import/order
import config from '../../config';

import { ManagerApp } from '@cypherock/sdk-app-manager';
import { Command } from '@oclif/core';

import { connectDevice, createConnection, getDevices } from '../../services';

export default class DeviceUpdate extends Command {
  static description = 'Update firmware on device';

  static examples = [`$ <%= config.bin %> <%= command.id %>`];

  async run(): Promise<void> {
    const connection = await createConnection();
    const app = await ManagerApp.create(connection);

    await app.updateFirmware({
      getDevices,
      createConnection: connectDevice,
      onProgress: p => this.log(p.toFixed(0)),
      allowPrerelease: config.ALLOW_PRERELEASE,
    });

    this.log('Update successful');
  }
}
