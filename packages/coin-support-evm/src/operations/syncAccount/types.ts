import { ISyncAccountsParams } from '@cypherock/coin-support-interfaces';
import { IAccount } from '@cypherock/db-interfaces';

export type ISyncEvmAccountsParams = ISyncAccountsParams;

export interface IEvmErc20TokenAccount extends IAccount {
  extraData: {
    contractAddress: string;
  };
}
