import { IDatabase } from '@cypherock/db-interfaces';

import { IPreparedEvmTransaction } from '../transaction';

export type HyspChain = 'eth_mainnet' | 'base';

export interface IHyspEvmPrepareParams {
  accountId: string;
  db: IDatabase;
  txn: IPreparedEvmTransaction;
  chain: HyspChain;
  walletAddress: string;
  tokenAddress: string;
  amount: number;
  countryCode?: string;
}

// no tokenOut needed, always approves mevUSD
export interface IHyspEvmApproveRedeemParams {
  accountId: string;
  db: IDatabase;
  txn: IPreparedEvmTransaction;
  chain: HyspChain;
  walletAddress: string;
  amount: number;
  countryCode?: string;
}

// Used for redeemInstant and redeemQueue (tokenOut required)
export interface IHyspEvmRedeemPrepareParams
  extends IHyspEvmApproveRedeemParams {
  tokenOut: string;
}

export interface IHyspServerTxParams {
  to: string;
  data: string;
  value: string;
  gasLimit: string;
}
