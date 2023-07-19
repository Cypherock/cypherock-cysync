import '../../config';

import { ManagerApp } from '@cypherock/sdk-app-manager';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { uint8ArrayToHex } from '@cypherock/sdk-utils';
import { Command } from '@oclif/core';
import colors from 'colors/safe';

import { runWithDevice } from '~/utils';

export default class WalletSync extends Command {
  static description = 'Sync wallets with device';

  static examples = [`$ <%= config.bin %> <%= command.id %>`];

  async main(connection: IDeviceConnection): Promise<void> {
    this.log(colors.blue('Getting wallets from device'));
    const app = await ManagerApp.create(connection);

    const { walletList } = await app.getWallets();

    this.logJson(walletList.map(e => ({ ...e, id: uint8ArrayToHex(e.id) })));

    await app.destroy();
  }

  async run(): Promise<void> {
    await runWithDevice(this.main.bind(this));
  }
}
