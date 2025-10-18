import {
  createSyncAccountsObservable,
  getLatestTransactionBlock,
  IGetAddressDetails,
} from '@cypherock/coin-support-utils';
import {
  IAccount,
  ITransaction,
  TransactionStatus,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';

import { ISyncCantonAccountsParams } from './types';

import * as services from '../../services';
import { ICantonAccount } from '../types';

const PER_PAGE_TXN_LIMIT = 100;

const parseTransaction = (
  address: string,
  account: IAccount,
  txn: services.IDetailedCantonResponseTransaction,
): ITransaction => {
  const myAddress = address;
  const fromAddress = txn.tx.Account;
  const toAddress = txn.tx.Destination;
  const fees = txn.tx.Fee;
  const amount = txn.tx.Amount;
  let status: TransactionStatus = TransactionStatusMap.failed;
  if (txn.meta.TransactionResult.startsWith('tes')) {
    status = TransactionStatusMap.success;
  } else if (txn.meta.TransactionResult.startsWith('ter')) {
    status = TransactionStatusMap.pending;
  }

  const transaction: ITransaction = {
    accountId: account.__id ?? '',
    walletId: account.walletId,
    assetId: account.assetId,
    familyId: account.familyId,
    parentAssetId: account.parentAssetId,
    hash: txn.tx.hash,
    confirmations: 1,
    fees,
    amount,
    status,
    type:
      myAddress === fromAddress
        ? TransactionTypeMap.send
        : TransactionTypeMap.receive,
    timestamp: new Date(parseInt(txn.tx.date.toString(), 10) * 1000).getTime(),
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
  address: string;
  account: IAccount;
  limit: number;
  ledgerIndexMin: number;
}) => {
  const { address, account, limit, ledgerIndexMin } = params;
  const response = await services.getTransactions({
    address,
    assetId: account.assetId,
    limit,
    forward: true,
    ledgerIndexMin,
  });

  const transactions: ITransaction[] = [];
  for (const rawTransaction of response.transactions) {
    const transaction = parseTransaction(address, account, rawTransaction);

    transactions.push({ ...transaction });
  }

  const { hasMore, offset } = response;

  return {
    transactions,
    hasMore,
    offset,
  };
};

const getAddressDetails: IGetAddressDetails<{
  perPage: number;
  afterBlock?: number;
  updatedBalance?: string;
}> = async ({ db, account, iterationContext }) => {
  const address = account.xpubOrAddress;

  const updatedBalance =
    iterationContext?.updatedBalance ??
    (await services.getBalance(address, account.assetId));

  const afterBlock =
    iterationContext?.afterBlock ??
    (await getLatestTransactionBlock(db, {
      accountId: account.__id,
    })) ??
    -1;

  const perPage = iterationContext?.perPage ?? PER_PAGE_TXN_LIMIT;

  const transactionDetails = await fetchAndParseTransactions({
    address,
    account,
    limit: perPage,
    ledgerIndexMin: afterBlock,
  });

  const updatedAccountInfo: Partial<ICantonAccount> = {
    balance: updatedBalance,
  };

  return {
    hasMore: transactionDetails.hasMore,
    nextIterationContext: {
      perPage,
      afterBlock: transactionDetails.offset,
      updatedBalance,
    },
    transactions: transactionDetails.transactions,
    updatedAccountInfo,
  };
};

export const syncAccount = (params: ISyncCantonAccountsParams) =>
  createSyncAccountsObservable({
    ...params,
    getAddressDetails,
  });
