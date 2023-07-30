import '../../config';

import { receiveFunds } from '~/services';
import { BaseCommand } from '~/utils';

export default class Receive extends BaseCommand<typeof Receive> {
  static description = 'Receive funds into an account';

  static examples = [`$ <%= config.bin %> <%= command.id %>`];

  protected connectToDatabase = true;

  async run(): Promise<void> {
    await receiveFunds({ db: this.db });
  }
}
