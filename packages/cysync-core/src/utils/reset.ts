import { ResetCySync } from '@cypherock/cysync-interfaces';

let resetCySyncMethod: ResetCySync | undefined;

export const getResetCySyncMethod = () => {
  if (!resetCySyncMethod) {
    throw new Error('Reset cysync method has not been defined');
  }

  return resetCySyncMethod;
};

export const setResetCySyncMethod = (method: ResetCySync) => {
  resetCySyncMethod = method;
};
