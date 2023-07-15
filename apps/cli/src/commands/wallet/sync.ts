import '../../config';

import { ManagerApp } from '@cypherock/sdk-app-manager';
import { uint8ArrayToHex } from '@cypherock/sdk-utils';
import { Command } from '@oclif/core';

import { createConnection } from '../../services';

export default class WalletSync extends Command {
  static description = 'Sync wallets with device';

  static examples = [`$ <%= config.bin %> <%= command.id %>`];

  async run(): Promise<void> {
    const connection = await createConnection();
    const app = await ManagerApp.create(connection);

    const { walletList } = await app.getWallets();

    this.logJson(walletList.map(e => ({ ...e, id: uint8ArrayToHex(e.id) })));
  }
}
