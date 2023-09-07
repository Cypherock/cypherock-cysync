// eslint-disable-next-line import/order
import '../../config';

import { ManagerApp } from '@cypherock/sdk-app-manager';
import colors from 'colors/safe';

import { authDevice } from '~/services';
import { BaseCommand } from '~/utils';

export default class DeviceAuth extends BaseCommand<typeof DeviceAuth> {
  static description = 'Authenticate device';

  static examples = [`$ <%= config.bin %> <%= command.id %>`];

  protected connectToDevice = true;

  async run(): Promise<void> {
    const app = await ManagerApp.create(this.connection);

    this.log(colors.blue('Starting device auth'));
    await authDevice(app);
  }
}
