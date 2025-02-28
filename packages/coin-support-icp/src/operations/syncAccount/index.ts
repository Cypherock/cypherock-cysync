import {
  createSyncAccountsObservable,
  getLatestTransactionHash,
  IGetAddressDetails,
} from '@cypherock/coin-support-utils';
import {
  IAccount,
  ITransaction,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';
import { TransactionWithId } from '@dfinity/ledger-icp';

import { ISyncIcpAccountsParams } from './types';

import * as services from '../../services';
import { IIcpAccount } from '../types';

const PER_PAGE_TXN_LIMIT = 100;

const parseTransaction = (
  address: string,
  account: IAccount,
  txn: TransactionWithId,
): ITransaction | undefined => {
  let transaction: ITransaction | undefined;

  if ('Transfer' in txn.transaction.operation) {
    const myAddress = address;
    const fromAddress = txn.transaction.operation.Transfer.from;
    const toAddress = txn.transaction.operation.Transfer.to;
    const fees = txn.transaction.operation.Transfer.fee.e8s.toString();
    const amount = txn.transaction.operation.Transfer.amount.e8s.toString();

    transaction = {
      accountId: account.__id ?? '',
      walletId: account.walletId,
      assetId: account.assetId,
      familyId: account.familyId,
      parentAssetId: account.parentAssetId,
      hash: txn.id.toString(), // tx hash not present, using txn id instead for now
      confirmations: 1,
      fees,
      amount,
      status: TransactionStatusMap.success,
      type:
        myAddress === fromAddress
          ? TransactionTypeMap.send
          : TransactionTypeMap.receive,
      timestamp: new Date(
        Number(
          // converting timestamp_nanos to millis
          BigInt(txn.transaction.timestamp[0]?.timestamp_nanos ?? 0) /
            BigInt(1e6),
        ),
      ).getTime(),
      blockHeight: Number(txn.id),
      inputs: [
        {
          address: fromAddress,
          amount,
          isMine: myAddress === fromAddress,
        },
      ],
      outputs: [
        {
          address: toAddress,
          amount,
          isMine: myAddress === toAddress,
        },
      ],
      extraData: {
        memo: txn.transaction.memo.toString(),
      },
    };
  }

  return transaction;
};

const fetchAndParseTransactions = async (params: {
  address: string;
  account: IAccount;
  limit: number;
  beforeTransactionId?: bigint;
  afterTransactionId: bigint;
}) => {
  const { address, account, limit, beforeTransactionId, afterTransactionId } =
    params;
  const txns = await services.getTransactions(
    address,
    BigInt(limit),
    beforeTransactionId,
  );

  let hasMore = true;
  let lastTransactionId = BigInt(0);

  const transactions: ITransaction[] = [];
  for (const txn of txns) {
    if (txn.id <= afterTransactionId) {
      hasMore = false;
      lastTransactionId = txn.id;
      break;
    }

    const transaction = parseTransaction(address, account, txn);
    if (transaction) transactions.push({ ...transaction });
  }

  if (hasMore) {
    hasMore = limit <= txns.length;
    lastTransactionId = txns.length ? txns[txns.length - 1].id : BigInt(0);
  }

  return {
    transactions,
    hasMore,
    lastTransactionId,
  };
};

const getAddressDetails: IGetAddressDetails<{
  perPage: number;
  beforeTransactionId?: bigint;
  afterTransactionId?: bigint;
  updatedBalance?: string;
}> = async ({ account, db, iterationContext }) => {
  const address = account.xpubOrAddress;

  const updatedBalance =
    iterationContext?.updatedBalance ?? (await services.getBalance(address));

  const perPage = iterationContext?.perPage ?? PER_PAGE_TXN_LIMIT;

  // Getting afterTransactionId from txn hash instead of block because
  // txn id is a bigint and block is a number. Block value might not be accurate
  const afterTransactionId =
    iterationContext?.afterTransactionId ??
    BigInt(
      (await getLatestTransactionHash(db, {
        accountId: account.__id,
        status: TransactionStatusMap.success,
      })) ?? 0,
    );

  const transactionDetails = await fetchAndParseTransactions({
    address,
    account,
    limit: perPage,
    beforeTransactionId: iterationContext?.beforeTransactionId,
    afterTransactionId,
  });

  const updatedAccountInfo: Partial<IIcpAccount> = {
    balance: updatedBalance,
  };

  return {
    hasMore: transactionDetails.hasMore,
    nextIterationContext: {
      perPage,
      beforeTransactionId: transactionDetails.lastTransactionId,
      afterTransactionId,
      updatedBalance,
    },
    transactions: transactionDetails.transactions,
    updatedAccountInfo,
  };
};

export const syncAccount = (params: ISyncIcpAccountsParams) =>
  createSyncAccountsObservable({
    ...params,
    getAddressDetails,
  });
