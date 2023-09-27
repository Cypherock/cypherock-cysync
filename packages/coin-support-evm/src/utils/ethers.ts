import type { ethers } from 'ethers';

export type ethersLibType = typeof ethers;

let ethersLibInstance: ethersLibType | undefined;

export const getCoinSupportEthersLib = () => {
  if (!ethersLibInstance) {
    throw new Error('ethers has not been set yet');
  }
  return ethersLibInstance;
};

export const setCoinSupportEthersLib = (ethersLibrary: ethersLibType) => {
  ethersLibInstance = ethersLibrary;
};
