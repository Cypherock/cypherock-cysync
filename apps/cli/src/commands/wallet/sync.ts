import '../../config';

import { ManagerApp } from '@cypherock/sdk-app-manager';
import colors from 'colors/safe';

import { getDeviceInfo, syncWallets } from '~/services';
import { BaseCommand } from '~/utils';

export default class WalletSync extends BaseCommand<typeof WalletSync> {
  static description = 'Sync wallets with device';

  static examples = [`$ <%= config.bin %> <%= command.id %>`];

  protected connectToDevice = true;

  protected connectToDatabase = true;

  async run(): Promise<void> {
    this.log(colors.blue('Getting wallets from device'));

    const app = await ManagerApp.create(this.connection);

    const deviceInfo = await getDeviceInfo(app);
    const { walletList } = await app.getWallets();
    await app.destroy();

    await syncWallets({
      db: this.db,
      wallets: walletList,
      deviceId: deviceInfo.deviceSerial,
    });

    this.log(colors.green('Synced wallets from device'));
  }
}
