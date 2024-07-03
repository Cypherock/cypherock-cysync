import { ISyncAccountsParams } from '@cypherock/coin-support-interfaces';
import { IAccount } from '@cypherock/db-interfaces';

export type ISyncTronAccountsParams = ISyncAccountsParams;

export interface ITronTrc20TokenAccount extends IAccount {
  extraData: {
    contractAddress: string;
  };
}
