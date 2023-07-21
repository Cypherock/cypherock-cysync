import '../../config';

import { Flags } from '@oclif/core';

import { listWallets } from '~/services';
import { BaseCommand } from '~/utils';

export default class WalletList extends BaseCommand<typeof WalletList> {
  static description = 'List wallets present on CLI';

  static examples = [`$ <%= config.bin %> <%= command.id %>`];

  static flags = {
    short: Flags.boolean({
      char: 's',
      description: 'Short log format',
    }),
  };

  protected connectToDatabase = true;

  async run(): Promise<void> {
    const { flags } = await this.parse(WalletList);

    await listWallets(this.db, { flags });
  }
}
