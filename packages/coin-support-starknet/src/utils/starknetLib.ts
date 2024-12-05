import type starknet from 'starknet';

export type StarknetLibType = typeof starknet;

let starknetLibInstance: StarknetLibType | undefined;

export const getCoinSupportStarknetLib = () => {
  if (!starknetLibInstance) {
    throw new Error('starknetLib has not been set yet');
  }
  return starknetLibInstance;
};

export const setCoinSupportStarknetLib = (starknetLib: StarknetLibType) => {
  starknetLibInstance = starknetLib;
};
