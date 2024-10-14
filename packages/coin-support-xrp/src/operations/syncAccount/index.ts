import {
  createSyncAccountsObservable,
  getLatestTransactionBlock,
  IGetAddressDetails,
} from '@cypherock/coin-support-utils';
import {
  IAccount,
  ITransaction,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';

import { ISyncXrpAccountsParams } from './types';

import * as services from '../../services';
import { IXrpAccount } from '../types';

const PER_PAGE_TXN_LIMIT = 100;

const parseTransaction = (
  account: IAccount,
  txn: services.IDetailedXrpResponseTransaction,
): ITransaction => {
  const myAddress = account.xpubOrAddress;
  const fromAddress = txn.tx.Account;
  const toAddress = txn.tx.Destination;
  const fees = txn.tx.Fee;
  const amount = txn.tx.Amount;

  const transaction: ITransaction = {
    accountId: account.__id ?? '',
    walletId: account.walletId,
    assetId: account.assetId,
    familyId: account.familyId,
    parentAssetId: account.parentAssetId,
    hash: txn.tx.hash,
    fees,
    amount,
    status: txn.meta.TransactionResult.startsWith('tes')
      ? TransactionStatusMap.success
      : TransactionStatusMap.failed,
    type:
      myAddress === fromAddress
        ? TransactionTypeMap.send
        : TransactionTypeMap.receive,
    timestamp: txn.tx.date,
    blockHeight: txn.tx.ledger_index,
    inputs: [
      {
        address: fromAddress,
        amount,
        isMine: myAddress === fromAddress,
      },
    ],
    outputs: [
      {
        address: txn.tx.Destination,
        amount,
        isMine: myAddress === toAddress,
      },
    ],
    extraData: {
      destinationTag: txn.tx.DestinationTag,
      flags: txn.tx.Flags,
      sequence: txn.tx.Sequence,
      lastLedgerSequence: txn.tx.LastLedgerSequence,
    },
  };
  return transaction;
};

const fetchAndParseTransactions = async (params: {
  account: IAccount;
  limit: number;
  ledgerIndexMin: number;
}) => {
  const { account } = params;
  const response = await services.getTransactions({
    address: account.xpubOrAddress,
    assetId: account.assetId,
    limit: params.limit,
    forward: true,
    ledgerIndexMin: params.ledgerIndexMin,
  });

  const transactions: ITransaction[] = [];
  for (let i = 0; i < response.transactions.length; i += 1) {
    const rawTransaction = response.transactions[i];
    if (
      rawTransaction.tx.TransactionType !== 'Payment' ||
      typeof rawTransaction.tx.Amount !== 'string'
    ) {
      continue;
    }

    const transaction = parseTransaction(account, rawTransaction);

    transactions.push({ ...transaction });
  }

  const hasMore = response.limit === response.transactions.length;
  const nextLedgerIndexMin = hasMore ? response.marker.ledger : -1;

  return {
    transactions,
    hasMore,
    nextLedgerIndexMin,
  };
};

const getAddressDetails: IGetAddressDetails<{
  perPage: number;
  afterBlock?: number;
  updatedBalance?: string;
}> = async ({ db, account, iterationContext }) => {
  const updatedBalance =
    iterationContext?.updatedBalance ??
    (await services.getBalance(account.xpubOrAddress, account.assetId));

  const afterBlock =
    iterationContext?.afterBlock ??
    (await getLatestTransactionBlock(db, {
      accountId: account.__id,
    })) ??
    -1;

  const perPage = iterationContext?.perPage ?? PER_PAGE_TXN_LIMIT;

  const transactionDetails = await fetchAndParseTransactions({
    account,
    limit: perPage,
    ledgerIndexMin: afterBlock,
  });

  const updatedAccountInfo: Partial<IXrpAccount> = {
    balance: updatedBalance,
  };

  return {
    hasMore: transactionDetails.hasMore,
    nextIterationContext: {
      perPage,
      afterBlock: transactionDetails.nextLedgerIndexMin,
    },
    transactions: transactionDetails.transactions,
    updatedAccountInfo,
  };
};

export const syncAccount = (params: ISyncXrpAccountsParams) =>
  createSyncAccountsObservable({
    ...params,
    getAddressDetails,
  });
