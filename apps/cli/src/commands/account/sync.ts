import '../../config';

import { syncAccounts } from '~/services';
import { BaseCommand } from '~/utils';

export default class AccountAdd extends BaseCommand<typeof AccountAdd> {
  static description = 'Sync accounts from blockchain';

  static examples = [`$ <%= config.bin %> <%= command.id %>`];

  protected connectToDatabase = true;

  async run(): Promise<void> {
    await syncAccounts({ db: this.db });
  }
}
