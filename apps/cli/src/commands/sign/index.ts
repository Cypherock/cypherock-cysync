import '../../config';

import { signMessage } from '~/services';
import { BaseCommand } from '~/utils';

export default class Sign extends BaseCommand<typeof Sign> {
  static description = 'Sign message from an account';

  static examples = [`$ <%= config.bin %> <%= command.id %>`];

  protected connectToDatabase = true;

  protected connectToDevice = true;

  async run(): Promise<void> {
    await signMessage({ db: this.db, connection: this.connection });
  }
}
