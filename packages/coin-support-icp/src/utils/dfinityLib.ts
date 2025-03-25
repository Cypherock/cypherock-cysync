import type agent from '@dfinity/agent';
import type candid from '@dfinity/candid';
import type icp from '@dfinity/ledger-icp';
import type icrc from '@dfinity/ledger-icrc';
import type principal from '@dfinity/principal';

export interface DfinityLib {
  agent: typeof agent;
  icp: typeof icp;
  icrc: typeof icrc;
  candid: typeof candid;
  principal: typeof principal;
}

let dfinityLibInstance: DfinityLib | undefined;

export const getCoinSupportDfinityLib = () => {
  if (!dfinityLibInstance) {
    throw new Error('dfinityLib has not been set yet');
  }
  return dfinityLibInstance;
};

export const setCoinSupportDfinityLib = (dfinityLib: DfinityLib) => {
  dfinityLibInstance = dfinityLib;
};
