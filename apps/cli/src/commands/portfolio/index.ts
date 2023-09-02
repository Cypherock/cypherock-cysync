import '../../config';

import { showPortfolio } from '~/services';
import { BaseCommand } from '~/utils';

export default class Portfolio extends BaseCommand<typeof Portfolio> {
  static description = 'Show Portfolio of Accounts';

  static examples = [`$ <%= config.bin %> <%= command.id %>`];

  protected connectToDatabase = true;

  async run(): Promise<void> {
    await showPortfolio(this.db);
  }
}
