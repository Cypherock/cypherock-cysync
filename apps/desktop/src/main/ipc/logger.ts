import { ipcConfig } from './helpers/config';

import { logWithServiceAndLevel } from '../utils/logger';

export const getLoggerIPCHandlers = () => [
  {
    name: ipcConfig.methods.logWithServiceAndLevel,
    func: logWithServiceAndLevel,
  },
];
