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

import { ISyncXrpAccountsParams } from './types';

import * as services from '../../services';
import { deriveAddress } from '../../utils';
import { IXrpAccount } from '../types';

const PER_PAGE_TXN_LIMIT = 100;
const J2000 = 946684800000;

const parseTransaction = (
  address: string,
  account: IAccount,
  txn: services.IDetailedXrpResponseTransaction,
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
    fees,
    amount,
    status,
    type:
      myAddress === fromAddress
        ? TransactionTypeMap.send
        : TransactionTypeMap.receive,
    timestamp: new Date(
      parseInt(txn.tx.date.toString(), 10) * 1000 + J2000,
    ).getTime(), // the received date is w.r.t January 1, 2000, hence the conversion to unix
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
    if (
      rawTransaction.tx.TransactionType !== 'Payment' ||
      typeof rawTransaction.tx.Amount !== 'string'
    ) {
      continue;
    }

    const transaction = parseTransaction(address, account, rawTransaction);

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
  const address = deriveAddress(account.xpubOrAddress);

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
