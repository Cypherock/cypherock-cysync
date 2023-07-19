// eslint-disable-next-line import/order
import config from '../../config';

import { ManagerApp } from '@cypherock/sdk-app-manager';
import { DeviceState, IDeviceConnection } from '@cypherock/sdk-interfaces';
import { Command, Flags } from '@oclif/core';
import colors from 'colors/safe';
import semver from 'semver';

import { updateFirmwareAndGetApp } from '~/services';
import { runWithDevice } from '~/utils';

export default class DeviceUpdate extends Command {
  static description = 'Update firmware on device';

  static examples = [`$ <%= config.bin %> <%= command.id %>`];

  static flags = {
    force: Flags.boolean({
      char: 'f',
      description: 'Force update even when device is already up to date',
    }),
  };

  async main(connection: IDeviceConnection): Promise<void> {
    this.log(colors.blue('Starting device firmware update'));

    const { flags } = await this.parse(DeviceUpdate);

    const app = await ManagerApp.create(connection);

    if (
      !flags.force &&
      (await connection.getDeviceState()) !== DeviceState.BOOTLOADER
    ) {
      const latestVersion = await ManagerApp.getLatestFirmware({
        prerelease: config.ALLOW_PRERELEASE,
      });

      const deviceInfo = await app.getDeviceInfo();

      if (
        deviceInfo.firmwareVersion &&
        semver.gte(
          `${deviceInfo.firmwareVersion.major}.${deviceInfo.firmwareVersion.minor}.${deviceInfo.firmwareVersion.patch}`,
          latestVersion.version,
        )
      ) {
        this.log(colors.green('Device firmware is already up to date'));
        return;
      }
    }

    await updateFirmwareAndGetApp(app);

    this.log(colors.green('Device firmware Update successful'));
    await app.destroy();
  }

  async run(): Promise<void> {
    await runWithDevice(this.main.bind(this));
  }
}
