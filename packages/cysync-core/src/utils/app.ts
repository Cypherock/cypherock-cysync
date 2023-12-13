import { CloseApp, FocusApp, OpenLink } from '@cypherock/cysync-interfaces';

let closeAppMethod: CloseApp | undefined;
let focusAppMethod: FocusApp | undefined;
let openLinkMethod: OpenLink | undefined;

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

export const getOpenLinkMethod = () => {
  if (!openLinkMethod) {
    throw new Error('Open Link method has not been defined');
  }

  return openLinkMethod;
};

export const setOpenLinkMethod = (method: OpenLink) => {
  openLinkMethod = method;
};
