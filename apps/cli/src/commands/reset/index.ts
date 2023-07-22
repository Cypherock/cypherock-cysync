import '../../config';

import { resetData } from '~/services';
import { BaseCommand } from '~/utils';

export default class Reset extends BaseCommand<typeof Reset> {
  static description = 'Reset CLI data';

  static examples = [`$ <%= config.bin %> <%= command.id %>`];

  protected connectToDatabase = true;

  async run(): Promise<void> {
    await resetData(this.db);
  }
}
