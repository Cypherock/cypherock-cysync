import { getCySyncLogs } from '../utils';
import { ipcConfig } from './helpers/config';

export const getCySyncLogsIPCHandlers = () => [
  {
    name: ipcConfig.methods.getCySyncLogs,
    func: getCySyncLogs,
  },
];
