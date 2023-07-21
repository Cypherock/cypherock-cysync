import '../../config';

import { addAccount } from '~/services';
import { BaseCommand } from '~/utils';

export default class AccountAdd extends BaseCommand<typeof AccountAdd> {
  static description = 'Add account';

  static examples = [`$ <%= config.bin %> <%= command.id %>`];

  protected connectToDevice = true;

  protected connectToDatabase = true;

  async run(): Promise<void> {
    await addAccount({ db: this.db, connection: this.connection });
  }
}
