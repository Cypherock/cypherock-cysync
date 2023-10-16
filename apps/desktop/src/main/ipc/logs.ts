import { ipcConfig } from './helpers/config';

import { getCySyncLogs } from '../utils';

export const getCySyncLogsIPCHandlers = () => [
  {
    name: ipcConfig.methods.getCySyncLogs,
    func: getCySyncLogs,
  },
];
