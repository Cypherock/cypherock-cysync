import '../../config';

import { Flags } from '@oclif/core';

import { listAccounts } from '~/services';
import { BaseCommand } from '~/utils';

export default class AccountList extends BaseCommand<typeof AccountList> {
  static description = 'List accounts present on CLI';

  static examples = [`$ <%= config.bin %> <%= command.id %>`];

  static flags = {
    short: Flags.boolean({
      char: 's',
      description: 'Short log format',
    }),
  };

  protected connectToDatabase = true;

  async run(): Promise<void> {
    const { flags } = await this.parse(AccountList);

    await listAccounts(this.db, { flags });
  }
}
