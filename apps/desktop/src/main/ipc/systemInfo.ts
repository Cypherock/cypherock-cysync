import { ipcConfig } from './helpers/config';

import { getSystemInfo } from '../utils';

export const getSystemInfoIPCHandlers = () => [
  {
    name: ipcConfig.methods.getSystemInfo,
    func: getSystemInfo,
  },
];
