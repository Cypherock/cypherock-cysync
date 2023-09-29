import { ipcConfig } from './helpers/config';

export const getCySyncLogsIPCHandlers = () => [
  {
    name: ipcConfig.methods.getCySyncLogs,
    func: async () => 'ipc: getCySyncLogs',
  },
];
