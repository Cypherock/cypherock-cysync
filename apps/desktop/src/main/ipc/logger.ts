import { logWithServiceAndLevel } from '../utils/logger';
import { ipcConfig } from './config';

export const getLoggerIPCHandlers = () => [
  {
    name: ipcConfig.logWithServiceAndLevel,
    func: logWithServiceAndLevel,
  },
];
