import { logWithServiceAndLevel } from '../utils/logger';
import { ipcConfig } from './helpers/config';

export const getLoggerIPCHandlers = () => [
  {
    name: ipcConfig.methods.logWithServiceAndLevel,
    func: logWithServiceAndLevel,
  },
];
