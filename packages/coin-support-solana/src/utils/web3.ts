import type * as Web3 from '@solana/web3.js';

export type web3LibType = typeof Web3;

let web3LibInstance: web3LibType | undefined;

export const getCoinSupportWeb3Lib = () => {
  if (!web3LibInstance) {
    throw new Error('Solana web3 has not been set yet');
  }
  return web3LibInstance;
};

export const setCoinSupportWeb3Lib = (web3Library: web3LibType) => {
  web3LibInstance = web3Library;
};
