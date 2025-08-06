import {
  createSyncAccountsObservable,
  getLatestTransactionBlock,
  IGetAddressDetails,
} from '@cypherock/coin-support-utils';
import { BigNumber } from '@cypherock/cysync-utils';
import {
  IAccount,
  ITransaction,
  TransactionStatus,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';

import { ISyncStellarAccountsParams } from './types';

import * as services from '../../services';
import { deriveAddress } from '../../utils';
import { IStellarAccount } from '../types';

const PER_PAGE_TXN_LIMIT = 100;

const parseTransaction = (
  address: string,
  account: IAccount,
  txn: services.IDetailedStellarResponseTransaction,
): ITransaction => {
  const myAddress = address;

  const transaction = txn.tx || (txn as any);

  const fromAddress =
    transaction.operations[0]?.from || transaction.source_account;
  const toAddress = transaction.operations[0]?.to || '';
  const fees = transaction.fee_charged || '100';
  const amount = transaction.operations[0]?.amount || '0';

  if (!fromAddress || !toAddress || !fees || !amount) {
    throw new Error(`Missing required transaction fields`);
  }

  let status: TransactionStatus = TransactionStatusMap.success;
  if ((transaction as any).successful === false) {
    status = TransactionStatusMap.failed;
  }

  const isCreateAccount = transaction.operations[0]?.type === 'create_account';
  const isSend = myAddress === fromAddress;

  let timestamp: number;
  if (transaction.date) {
    timestamp = transaction.date;
  } else if ((transaction as any).created_at) {
    timestamp = Math.floor(
      new Date((transaction as any).created_at).getTime() / 1000,
    );
  } else {
    timestamp = Math.floor(Date.now() / 1000);
  }

  let sequence: number;
  if (transaction.sequence) {
    sequence = transaction.sequence;
  } else if ((transaction as any).source_account_sequence) {
    sequence = Number((transaction as any).source_account_sequence);
  } else {
    sequence = 0;
  }

  const parsedTransaction: ITransaction = {
    accountId: account.__id ?? '',
    walletId: account.walletId,
    assetId: account.assetId,
    familyId: account.familyId,
    parentAssetId: account.parentAssetId,
    hash: transaction.hash || '',
    confirmations: 1,
    fees: String(fees),
    amount: String(amount),
    status,
    type: isSend ? TransactionTypeMap.send : TransactionTypeMap.receive,
    timestamp,
    blockHeight: transaction.ledger || 0,
    inputs: [
      {
        address: String(fromAddress),
        amount: String(amount),
        isMine: isSend,
      },
    ],
    outputs: [
      {
        address: String(toAddress),
        amount: String(amount),
        isMine: !isSend,
      },
    ],
    extraData: {
      memo:
        (transaction as any).memo_type &&
        (transaction as any).memo_type !== 'none'
          ? `${(transaction as any).memo_type}: ${
              (transaction as any).memo || ''
            }`
          : undefined,
      isCreateAccount,
      sequence,
    },
  };

  if (!parsedTransaction.hash || !parsedTransaction.accountId) {
    throw new Error(`Invalid transaction data: missing hash or accountId`);
  }

  return parsedTransaction;
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
    const transactionToCheck = rawTransaction.tx || rawTransaction;

    if (
      !transactionToCheck.operations[0] ||
      !['payment', 'create_account'].includes(
        transactionToCheck.operations[0].type,
      ) ||
      typeof transactionToCheck.operations[0].amount !== 'string'
    ) {
      continue;
    }

    const transaction = parseTransaction(address, account, rawTransaction);
    transactions.push({ ...transaction });
  }

  const responseAny = response as any;
  const hasMore =
    response.transactions.length >= limit && !!responseAny.next?.cursor;
  const nextLedgerIndexMin = hasMore ? Number(responseAny.next.cursor) : -1;

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
  updatedSpendableBalance?: string;
}> = async ({ db, account, iterationContext }) => {
  const address = deriveAddress(account.xpubOrAddress);

  const isActivated = await services.getIsAccountActivated(
    address,
    account.assetId,
  );

  if (!isActivated) {
    return {
      hasMore: false,
      nextIterationContext: {
        ...iterationContext,
        perPage: iterationContext?.perPage ?? PER_PAGE_TXN_LIMIT,
        afterBlock: iterationContext?.afterBlock ?? -1,
        updatedBalance: '0',
        updatedSpendableBalance: '0',
      },
      transactions: [],
      updatedAccountInfo: {
        balance: '0',
        spendableBalance: '0',
      },
    };
  }

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

  const updatedAccountInfo: Partial<IStellarAccount> = {
    balance: updatedBalance,
    spendableBalance: updatedSpendableBalance,
  };

  const result = {
    hasMore: transactionDetails.hasMore,
    nextIterationContext: {
      perPage,
      afterBlock:
        transactionDetails.nextLedgerIndexMin !== -1
          ? transactionDetails.nextLedgerIndexMin
          : afterBlock,
      updatedBalance,
      updatedSpendableBalance,
    },
    transactions: transactionDetails.transactions,
    updatedAccountInfo,
  };

  return result;
};

export const syncAccount = (params: ISyncStellarAccountsParams) =>
  createSyncAccountsObservable({
    ...params,
    getAddressDetails,
  });
