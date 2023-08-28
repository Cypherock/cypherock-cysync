// eslint-disable-next-line import/order
import '../../config';

import colors from 'colors/safe';

import { fetchLogsFromDevice } from '~/services';
import { BaseCommand } from '~/utils';

export default class DeviceLogs extends BaseCommand<typeof DeviceLogs> {
  static description = 'Fetch device logs';

  static examples = [`$ <%= config.bin %> <%= command.id %>`];

  protected connectToDevice = true;

  async run(): Promise<void> {
    this.log(colors.blue('Starting device firmware update'));
    await fetchLogsFromDevice(this.connection);
  }
}
