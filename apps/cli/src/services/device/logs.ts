import fs from 'fs/promises';

import { ManagerApp } from '@cypherock/sdk-app-manager';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';

import { queryInput, Spinner } from '~/utils';

const name = 'Fetching Device Logs';

export const fetchLogsFromDevice = async (connection: IDeviceConnection) => {
  const filePath = (
    await queryInput('Enter log file path', 'device.log')
  ).trim();
  const spinner = await Spinner.create(name);

  try {
    const app = await ManagerApp.create(connection);
    let logs = await app.getLogs();

    logs = `************** ${new Date().toLocaleString()} ****************\n${logs}`;
    await fs.appendFile(filePath, logs);

    spinner.succeed(name);
  } catch (error) {
    spinner.fail();
    throw error;
  }
};
