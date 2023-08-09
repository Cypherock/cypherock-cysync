import '../../config';

import { sendFunds } from '~/services';
import { BaseCommand } from '~/utils';

export default class Send extends BaseCommand<typeof Send> {
  static description = 'Send funds from an account';

  static examples = [`$ <%= config.bin %> <%= command.id %>`];

  protected connectToDatabase = true;

  protected connectToDevice = true;

  async run(): Promise<void> {
    await sendFunds({ db: this.db, connection: this.connection });
  }
}
