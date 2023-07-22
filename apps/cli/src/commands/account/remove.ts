import '../../config';

import { removeAccount } from '~/services';
import { BaseCommand } from '~/utils';

export default class AccountRemove extends BaseCommand<typeof AccountRemove> {
  static description = 'Remove account from CLI';

  static examples = [`$ <%= config.bin %> <%= command.id %>`];

  protected connectToDatabase = true;

  async run(): Promise<void> {
    await removeAccount(this.db);
  }
}
