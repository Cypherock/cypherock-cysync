import type xrpl from 'xrpl';

export type XrpLibType = typeof xrpl;

let xrpLibInstance: XrpLibType | undefined;

export const getCoinSupportXrpLib = () => {
  if (!xrpLibInstance) {
    throw new Error('xrpLib has not been set yet');
  }
  return xrpLibInstance;
};

export const setCoinSupportXrpLib = (xrpLib: XrpLibType) => {
  xrpLibInstance = xrpLib;
};
