import {
  createSyncAccountsObservable,
  getLatestTransactionHash,
  IGetAddressDetails,
} from '@cypherock/coin-support-utils';
import { icpCoinList } from '@cypherock/coins';
import {
  AccountTypeMap,
  IAccount,
  ITransaction,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';
import { uint8ArrayToHex } from '@cypherock/sdk-utils';
import type { TransactionWithId } from '@dfinity/ledger-icp';
import type { IcrcTransactionWithId } from '@dfinity/ledger-icrc';

import { ISyncIcpAccountsParams } from './types';

import * as services from '../../services';
import { derivePrincipal, getCoinSupportDfinityLib } from '../../utils';
import { IIcpAccount } from '../types';

const PER_PAGE_TXN_LIMIT = 100;

const createTransaction = (
  account: IAccount,
  myAddress: string,
  operation: string,
  txnId: bigint,
  timestamp: number,
  fees: string,
  amount: string,
  fromAddress?: string,
  toAddress?: string,
  memo?: string,
): ITransaction => ({
  accountId: account.__id ?? '',
  parentAccountId: account.parentAccountId,
  walletId: account.walletId,
  assetId: account.assetId,
  familyId: account.familyId,
  parentAssetId: account.parentAssetId,
  hash: txnId.toString(), // tx hash not present, using txn id instead for now
  confirmations: 1,
  fees,
  amount,
  status: TransactionStatusMap.success,
  type:
    myAddress === fromAddress
      ? TransactionTypeMap.send
      : TransactionTypeMap.receive,
  timestamp,
  blockHeight: Number(txnId),
  inputs: fromAddress
    ? [
        {
          address: fromAddress,
          amount,
          isMine: myAddress === fromAddress,
        },
      ]
    : [],
  outputs: toAddress
    ? [
        {
          address: toAddress,
          amount,
          isMine: myAddress === toAddress,
        },
      ]
    : [],
  extraData: {
    memo,
    operation,
  },
});

const parseTransaction = (
  address: string,
  account: IAccount,
  txn: TransactionWithId,
): ITransaction | undefined => {
  let transaction: ITransaction | undefined;

  const myAddress = address;

  const txnId = txn.id;
  const timestamp = new Date(
    Number(
      // converting timestamp_nanos to millis
      BigInt(txn.transaction.timestamp[0]?.timestamp_nanos ?? 0) / BigInt(1e6),
    ),
  ).getTime();

  if ('Transfer' in txn.transaction.operation) {
    const transferTxn = txn.transaction.operation.Transfer;

    transaction = createTransaction(
      account,
      myAddress,
      'transfer',
      txnId,
      timestamp,
      transferTxn.fee.e8s.toString(),
      transferTxn.amount.e8s.toString(),
      transferTxn.from,
      transferTxn.to,
      txn.transaction.memo.toString(),
    );
  } else if ('Approve' in txn.transaction.operation) {
    const approveTxn = txn.transaction.operation.Approve;

    transaction = createTransaction(
      account,
      myAddress,
      'approve',
      txnId,
      timestamp,
      approveTxn.fee.e8s.toString(),
      approveTxn.allowance.e8s.toString(),
      approveTxn.from,
      approveTxn.spender,
      txn.transaction.memo.toString(),
    );
  } else if ('Burn' in txn.transaction.operation) {
    const burnTxn = txn.transaction.operation.Burn;

    transaction = createTransaction(
      account,
      myAddress,
      'burn',
      txnId,
      timestamp,
      '0',
      burnTxn.amount.e8s.toString(),
      burnTxn.from,
      undefined,
      txn.transaction.memo.toString(),
    );
  } else if ('Mint' in txn.transaction.operation) {
    const mintTxn = txn.transaction.operation.Mint;

    transaction = createTransaction(
      account,
      myAddress,
      'mint',
      txnId,
      timestamp,
      '0',
      mintTxn.amount.e8s.toString(),
      undefined,
      mintTxn.to,
      txn.transaction.memo.toString(),
    );
  }

  return transaction;
};

const parseTokenTransaction = (
  principalId: Uint8Array,
  account: IAccount,
  txn: IcrcTransactionWithId,
): ITransaction | undefined => {
  let transaction: ITransaction | undefined;

  const { principal } = getCoinSupportDfinityLib();
  const myAddress = principal.Principal.from(principalId).toText();

  const txnId = txn.id;
  const timestamp = new Date(
    Number(
      // converting timestamp_nanos to millis
      txn.transaction.timestamp / BigInt(1e6),
    ),
  ).getTime();

  if (
    txn.transaction.kind === 'transfer' &&
    txn.transaction.transfer[0] !== undefined
  ) {
    const transferTxn = txn.transaction.transfer[0];

    transaction = createTransaction(
      account,
      myAddress,
      'transfer',
      txnId,
      timestamp,
      transferTxn.fee[0]?.toString() ?? '0',
      transferTxn.amount.toString(),
      transferTxn.from.owner.toText(),
      transferTxn.to.owner.toText(),
      transferTxn.memo[0]
        ? uint8ArrayToHex(new Uint8Array(transferTxn.memo[0]))
        : undefined,
    );
  } else if (
    txn.transaction.kind === 'approve' &&
    txn.transaction.approve[0] !== undefined
  ) {
    const approveTxn = txn.transaction.approve[0];

    transaction = createTransaction(
      account,
      myAddress,
      'approve',
      txnId,
      timestamp,
      approveTxn.fee[0]?.toString() ?? '0',
      approveTxn.amount.toString(),
      approveTxn.from.owner.toText(),
      approveTxn.spender.owner.toText(),
      approveTxn.memo[0]
        ? uint8ArrayToHex(new Uint8Array(approveTxn.memo[0]))
        : undefined,
    );
  } else if (
    txn.transaction.kind === 'burn' &&
    txn.transaction.burn[0] !== undefined
  ) {
    const burnTxn = txn.transaction.burn[0];

    transaction = createTransaction(
      account,
      myAddress,
      'burn',
      txnId,
      timestamp,
      '0',
      burnTxn.amount.toString(),
      burnTxn.from.owner.toText(),
      undefined,
      burnTxn.memo[0]
        ? uint8ArrayToHex(new Uint8Array(burnTxn.memo[0]))
        : undefined,
    );
  } else if (
    txn.transaction.kind === 'mint' &&
    txn.transaction.mint[0] !== undefined
  ) {
    const mintTxn = txn.transaction.mint[0];

    transaction = createTransaction(
      account,
      myAddress,
      'mint',
      txnId,
      timestamp,
      '0',
      mintTxn.amount.toString(),
      undefined,
      mintTxn.to.owner.toText(),
      mintTxn.memo[0]
        ? uint8ArrayToHex(new Uint8Array(mintTxn.memo[0]))
        : undefined,
    );
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

const fetchAndParseTokenTransactions = async (params: {
  principalId: Uint8Array;
  account: IAccount;
  tokenIndexCanisterId: string;
  limit: number;
  beforeTransactionId?: bigint;
  afterTransactionId: bigint;
}) => {
  const {
    principalId,
    account,
    tokenIndexCanisterId,
    limit,
    beforeTransactionId,
    afterTransactionId,
  } = params;

  const txns = await services.getTokenTransactions(
    principalId,
    tokenIndexCanisterId,
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

    const transaction = parseTokenTransaction(principalId, account, txn);
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

  let updatedBalance = iterationContext?.updatedBalance;

  let transactionDetails: {
    transactions: ITransaction[];
    hasMore: boolean;
    lastTransactionId: bigint;
  };

  const isTokenAccount = account.type === AccountTypeMap.subAccount;
  if (isTokenAccount) {
    const principalId = derivePrincipal(
      (account as IIcpAccount).extraData.publicKey,
    );

    const tokenDetails =
      icpCoinList[account.parentAssetId].tokens[account.assetId];

    updatedBalance ??= await services.getTokenBalance(
      principalId,
      tokenDetails.canisters.ledger,
    );

    transactionDetails = await fetchAndParseTokenTransactions({
      principalId,
      account,
      tokenIndexCanisterId: tokenDetails.canisters.index,
      limit: perPage,
      beforeTransactionId: iterationContext?.beforeTransactionId,
      afterTransactionId,
    });
  } else {
    const address = account.xpubOrAddress;

    updatedBalance ??= await services.getBalance(address);

    transactionDetails = await fetchAndParseTransactions({
      address,
      account,
      limit: perPage,
      beforeTransactionId: iterationContext?.beforeTransactionId,
      afterTransactionId,
    });
  }

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
