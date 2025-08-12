import {
  createSyncAccountsObservable,
  IGetAddressDetails,
} from '@cypherock/coin-support-utils';
import { BigNumber } from '@cypherock/cysync-utils';
import {
  IAccount,
  IDatabase,
  ITransaction,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';

import { ISyncStellarAccountsParams } from './types';

import * as services from '../../services';
import { IStellarAccount } from '../types';

const PER_PAGE_TXN_LIMIT = 100;

const parseTransactionOperation = (
  operation: services.IStellarOperationResponse,
  account: IAccount,
  txn: services.IStellarTransactionResponse,
  fees: string,
  operationIndex: number,
): ITransaction | undefined => {
  const myAddress = account.xpubOrAddress;
  const fromAddr = operation.sourceAccount ?? txn.sourceAccount;
  const { amount, destination: toAddr, type: operationType } = operation;

  if (fromAddr !== myAddress && toAddr !== myAddress) return undefined;

  const selfTransfer = fromAddr === toAddr;

  const isSend = fromAddr === myAddress;

  const transaction: ITransaction = {
    hash: txn.hash,
    accountId: account.__id ?? '',
    walletId: account.walletId,
    assetId: account.parentAssetId,
    parentAssetId: account.parentAssetId,
    familyId: account.familyId,
    amount: selfTransfer ? '0' : amount,
    fees: isSend && txn.feeAccount !== myAddress ? '0' : fees, // fee account might be different
    confirmations: 1,
    status: txn.successful
      ? TransactionStatusMap.success
      : TransactionStatusMap.failed,
    type: isSend ? TransactionTypeMap.send : TransactionTypeMap.receive,
    timestamp: new Date(txn.createdAt).getTime(),
    blockHeight: txn.ledger,
    inputs: [
      {
        address: fromAddr,
        amount,
        isMine: myAddress === fromAddr,
      },
    ],
    outputs: [
      {
        address: toAddr,
        amount,
        isMine: myAddress === toAddr,
      },
    ],
    customId: `id-${operationIndex}`,
    extraData: {
      operation: operationType,
      memoType: txn.memoType,
      memo: txn.memo,
      timeBounds: txn.preconditions?.timeBounds,
      pagingToken: txn.pagingToken,
    },
  };

  return transaction;
};

export const parseTransaction = (
  account: IAccount,
  txn: services.IStellarTransactionResponse,
): ITransaction[] => {
  const transactions: ITransaction[] = [];

  const fees = txn.feeCharged;

  // We show the fees only for the first operation to prevent double counting
  let isFeesAlreadyIncluded = false;

  let operationIndex = 0; // For txn custom id to generate a unique txn id in the db

  for (const operation of txn.operations) {
    const transaction = parseTransactionOperation(
      operation,
      account,
      txn,
      isFeesAlreadyIncluded ? '0' : fees,
      operationIndex,
    );

    if (transaction) {
      transactions.push(transaction);
      isFeesAlreadyIncluded = true;
      operationIndex += 1;
    }
  }

  // Include a fees txn if not already included and feeAccount is current account
  if (
    !isFeesAlreadyIncluded &&
    txn.feeAccount === account.xpubOrAddress &&
    fees !== '0'
  ) {
    transactions.push({
      hash: txn.hash,
      accountId: account.__id ?? '',
      walletId: account.walletId,
      assetId: account.assetId,
      parentAssetId: account.parentAssetId,
      familyId: account.familyId,
      amount: '0',
      fees: fees.toString(),
      confirmations: 1,
      status: TransactionStatusMap.success,
      type: TransactionTypeMap.hidden,
      timestamp: new Date(txn.createdAt).getTime(),
      blockHeight: txn.ledger,
      inputs: [],
      outputs: [],
      subType: 'feeDeduction',
      extraData: {
        memoType: txn.memoType,
        memo: txn.memo,
        timeBounds: txn.preconditions?.timeBounds,
        pagingToken: txn.pagingToken,
      },
    });
  }

  return transactions;
};

const fetchAndParseTransactions = async (params: {
  account: IAccount;
  limit: number;
  latestPagingToken?: string;
}) => {
  const { account, limit, latestPagingToken } = params;

  const response = await services.getTransactions({
    address: account.xpubOrAddress,
    assetId: account.assetId,
    limit,
    cursor: latestPagingToken,
  });

  const transactions: ITransaction[] = [];

  for (const txn of response.transactions) {
    const txns = parseTransaction(account, txn);
    transactions.push(...txns);
  }

  return {
    transactions,
    hasMore: response.hasMore,
    nextPagingToken: response.next?.cursor,
  };
};

const getLatestTransactionPagingToken = async (
  db: IDatabase,
  query: Partial<ITransaction>,
) => {
  const res = await db.transaction.getOne(
    { ...query, status: TransactionStatusMap.success },
    {
      sortBy: {
        key: 'blockHeight',
        descending: true,
      },
      limit: 1,
    },
  );

  if (!res) return undefined;

  return res.extraData?.pagingToken || undefined;
};

const getAddressDetails: IGetAddressDetails<{
  perPage: number;
  latestPagingToken?: string;
  updatedBalance?: string;
  updatedSpendableBalance?: string;
}> = async ({ db, account, iterationContext }) => {
  const address = account.xpubOrAddress;

  const updatedBalance =
    iterationContext?.updatedBalance ??
    (await services.getBalance(address, account.assetId));

  const updatedSpendableBalance =
    iterationContext?.updatedSpendableBalance ??
    BigNumber.max(
      0,
      new BigNumber(updatedBalance).minus(
        await services.getAccountReserveBalance(address, account.assetId),
      ),
    ).toString();

  const latestPagingToken =
    iterationContext?.latestPagingToken ??
    (await getLatestTransactionPagingToken(db, {
      accountId: account.__id,
    }));

  const perPage = iterationContext?.perPage ?? PER_PAGE_TXN_LIMIT;

  const { transactions, hasMore, nextPagingToken } =
    await fetchAndParseTransactions({
      account,
      limit: perPage,
      latestPagingToken,
    });

  const updatedAccountInfo: Partial<IStellarAccount> = {
    balance: updatedBalance,
    spendableBalance: updatedSpendableBalance,
  };

  return {
    hasMore,
    nextIterationContext: {
      perPage,
      latestPagingToken: nextPagingToken,
      updatedBalance,
      updatedSpendableBalance,
    },
    transactions,
    updatedAccountInfo,
  };
};

export const syncAccount = (params: ISyncStellarAccountsParams) =>
  createSyncAccountsObservable({
    ...params,
    getAddressDetails,
  });
