import type * as StellarSdk from 'stellar-sdk';

export type StellarLibType = typeof StellarSdk;

let stellarLibInstance: StellarLibType | undefined;

export const getCoinSupportStellarLib = () => {
  if (!stellarLibInstance) {
    throw new Error('stellarLib has not been set yet');
  }
  return stellarLibInstance;
};

export const setCoinSupportStellarLib = (stellarLib: StellarLibType) => {
  stellarLibInstance = stellarLib;
};
