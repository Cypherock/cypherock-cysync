import { ISyncAccountsParams } from '@cypherock/coin-support-interfaces';
import { IAccount } from '@cypherock/db-interfaces';

export type ISyncSolanaAccountsParams = ISyncAccountsParams;

export interface ISolanaSplTokenAccount extends IAccount {
  extraData: {
    contractAddress: string;
    latestTransactionHash?: string;
  };
}
