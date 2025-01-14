import type * as SplToken from '@solana/spl-token/lib/types';

export type splTokenLibType = typeof SplToken;

let splTokenLibInstance: splTokenLibType | undefined;

export const getTokenSupportSplTokenLib = () => {
  if (!splTokenLibInstance) {
    throw new Error('Solana splToken has not been set yet');
  }
  return splTokenLibInstance;
};

export const setTokenSupportSplTokenLib = (
  splTokenLibrary: splTokenLibType,
) => {
  splTokenLibInstance = splTokenLibrary;
};
