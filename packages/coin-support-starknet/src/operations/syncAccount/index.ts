import {
  IGetAddressDetails,
  createSyncAccountsObservable,
} from '@cypherock/coin-support-utils';
import { ITransaction } from '@cypherock/db-interfaces';

import { ISyncStarknetAccountsParams } from './types';

import { getBalance } from '../../services';
import { IStarknetAccount } from '../types';

const getAddressDetails: IGetAddressDetails<{
  transactionsTillNow?: ITransaction[];
  updatedBalance?: string;
  updatedAccountInfo?: Partial<IStarknetAccount>;
  afterTransactionBlock?: number;
  hasMoreTransactions?: boolean;
  afterInternalTransactionBlock?: number;
  hasMoreInternalTransactions?: boolean;
  afterContractTransactionBlock?: number;
  hasMoreContractTransactions?: boolean;
  fetchingMode?: 'transaction';
}> = async ({ db, account, iterationContext }) => {
  const {
    afterTransactionBlock,
    afterInternalTransactionBlock,
    hasMoreTransactions,
    hasMoreInternalTransactions,
    hasMoreContractTransactions,
    afterContractTransactionBlock,
    fetchingMode,
  } = iterationContext ?? {};
  let { transactionsTillNow } = iterationContext ?? {};
  let updatedBalance = iterationContext?.updatedBalance;

  if (!updatedBalance) {
    updatedBalance = (
      await getBalance(account.xpubOrAddress, account.parentAssetId)
    ).balance;
  }

  if (!transactionsTillNow) {
    transactionsTillNow = await db.transaction.getAll({
      accountId: account.__id,
    });
  }

  const updatedAccountInfo: Partial<IStarknetAccount> = {
    ...(iterationContext?.updatedAccountInfo ?? {}),
    balance: updatedBalance,
    extraData: {
      ...(account.extraData ?? {}),
    },
  };

  const transactions: ITransaction[] = [];

  const hasMore =
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    hasMoreTransactions || false;

  return {
    hasMore,
    transactions,
    updatedAccountInfo,
    nextIterationContext: {
      afterContractTransactionBlock,
      hasMoreContractTransactions,
      hasMoreTransactions,
      hasMoreInternalTransactions,
      afterInternalTransactionBlock,
      afterTransactionBlock,
      updatedBalance,
      updatedAccountInfo,
      fetchingMode,
      transactionsTillNow,
    },
  };
};

export const syncAccount = (params: ISyncStarknetAccountsParams) =>
  createSyncAccountsObservable({
    ...params,
    getAddressDetails,
  });
