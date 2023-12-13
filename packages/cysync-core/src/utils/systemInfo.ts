import { GetSystemInfo } from '@cypherock/cysync-interfaces';

let getSystemInfoMethod: GetSystemInfo | undefined;

export const getGetSystemInfoMethod = () => {
  if (!getSystemInfoMethod) {
    throw new Error('Get System info method has not been defined');
  }

  return getSystemInfoMethod;
};

export const setGetSystemInfoMethod = (method: GetSystemInfo) => {
  getSystemInfoMethod = method;
};
