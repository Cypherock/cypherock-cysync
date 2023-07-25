import '../../config';

import { Flags } from '@oclif/core';

import { listTransactions } from '~/services';
import { BaseCommand } from '~/utils';

export default class TransactionList extends BaseCommand<
  typeof TransactionList
> {
  static description = 'List transactions present on CLI';

  static examples = [`$ <%= config.bin %> <%= command.id %>`];

  static flags = {
    short: Flags.boolean({
      char: 's',
      description: 'Short log format',
    }),
  };

  protected connectToDatabase = true;

  async run(): Promise<void> {
    const { flags } = await this.parse(TransactionList);

    await listTransactions(this.db, { flags });
  }
}
