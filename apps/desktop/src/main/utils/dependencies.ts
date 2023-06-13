import { updateLogger as updateLoggerCore } from '@cypherock/sdk-core';
import { updateLogger as updateLoggerHID } from '@cypherock/sdk-hw-hid';
import { updateLogger as updateLoggerSerialPort } from '@cypherock/sdk-hw-serialport';

import { createServiceLogger } from './logger';

const createMainServiceLogger = (name: string) =>
  createServiceLogger(`main-${name}`);

export const setupDependencies = () => {
  updateLoggerHID(createMainServiceLogger);
  updateLoggerSerialPort(createMainServiceLogger);
  updateLoggerCore(createMainServiceLogger);
};
