import { GetCySyncLogs } from '@cypherock/cysync-interfaces';

let cySyncLogsMethod: GetCySyncLogs | undefined;

export const getCySyncLogsMethod = () => {
  if (!cySyncLogsMethod) {
    throw new Error('getCySyncLogs method has not been defined');
  }
  return cySyncLogsMethod;
};

export const setCySyncLogsMethod = (method: GetCySyncLogs) => {
  cySyncLogsMethod = method;
};
