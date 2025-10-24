import {
  createSyncAccountsObservable,
  IGetAddressDetails,
} from '@cypherock/coin-support-utils';
import {
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';

import { ISyncSiaAccountsParams } from './types';

import * as services from '../../services';

const getAddressDetails: IGetAddressDetails<Record<string, never>> = async ({
  account,
}) => {
  console.log('Get balance called ');
  const balance = await services.getBalance(account.xpubOrAddress);
  console.log('Recevied balance ', balance);

  const transactionHistory = await services.getTransactions(
    account.xpubOrAddress,
  );
  const transactions = transactionHistory.transactions.map(tx => ({
    hash: tx.id,
    amount: tx.amount,
    fees: tx.fee ?? '0',
    status: TransactionStatusMap.success,
    type:
      tx.type === 'send' ? TransactionTypeMap.send : TransactionTypeMap.receive,
    timestamp: new Date(tx.timestamp).getTime(),
    blockHeight: -1,
    confirmations: tx.confirmations,

    accountId: account.__id ?? '',
    walletId: account.walletId,
    assetId: account.assetId,
    parentAssetId: account.parentAssetId,
    familyId: account.familyId,

    inputs: [
      {
        address:
          tx.type === 'send' ? account.xpubOrAddress : tx.fromAddress ?? '',
        amount: tx.amount,
        isMine: tx.type === 'send',
      },
    ],
    outputs: [
      {
        address:
          tx.type === 'send' ? tx.toAddress ?? '' : account.xpubOrAddress,
        amount: tx.amount,
        isMine: tx.type === 'receive',
      },
    ],
  }));

  return {
    hasMore: false,
    transactions,
    updatedAccountInfo: {
      balance,
      spendableBalance: balance,
    },
    nextIterationContext: {},
  };
};

export const syncAccount = (params: ISyncSiaAccountsParams) =>
  createSyncAccountsObservable({
    ...params,
    getAddressDetails,
  });
