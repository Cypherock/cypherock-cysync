import { CloseApp, FocusApp } from '@cypherock/cysync-interfaces';

let closeAppMethod: CloseApp | undefined;
let focusAppMethod: FocusApp | undefined;

export const getCloseAppMethod = () => {
  if (!closeAppMethod) {
    throw new Error('Close app method has not been defined');
  }

  return closeAppMethod;
};

export const setCloseAppMethod = (method: CloseApp) => {
  closeAppMethod = method;
};

export const getFocusAppMethod = () => {
  if (!focusAppMethod) {
    throw new Error('Focus app method has not been defined');
  }

  return focusAppMethod;
};

export const setFocusAppMethod = (method: FocusApp) => {
  focusAppMethod = method;
};
