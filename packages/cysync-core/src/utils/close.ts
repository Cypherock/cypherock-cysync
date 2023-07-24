import { CloseApp } from '@cypherock/cysync-interfaces';

let closeAppMethod: CloseApp | undefined;

export const getCloseAppMethod = () => {
  if (!closeAppMethod) {
    throw new Error('Close app method has not been defined');
  }

  return closeAppMethod;
};

export const setCloseAppMethod = (method: CloseApp) => {
  closeAppMethod = method;
};
