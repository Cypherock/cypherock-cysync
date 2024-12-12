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

import { ISyncStarknetAccountsParams } from './types';

import * as services from '../../services';
import { IStarknetAccount } from '../types';

const PER_PAGE_TXN_LIMIT = 100;
const STRK_TOKEN_CONTRACT =
  '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d';
const STRKWARE_SEQUENCER_ADDRESS =
  '0x01176a1bd84444c89232ec27754698e5d2e7e1a7f1539f12027f28b23ec9f3d8';

const parseTransaction = (
  address: string,
  account: IAccount,
  txn: services.IStarknetResponseTransaction,
  amount: string,
  fees: string,
  transactionType: string,
): ITransaction => {
  const myAddress = address;
  const { fromAddress, toAddress } = txn;
  const status: TransactionStatus = TransactionStatusMap.success;

  const transaction: ITransaction = {
    accountId: account.__id ?? '',
    walletId: account.walletId,
    assetId: account.assetId,
    familyId: account.familyId,
    parentAssetId: account.parentAssetId,
    hash: txn.transactionHash,
    confirmations: 1,
    fees,
    amount,
    status,
    type:
      myAddress === fromAddress
        ? TransactionTypeMap.send
        : TransactionTypeMap.receive,
    timestamp: new Date(txn.blockTimestamp).getTime(),
    blockHeight: txn.blockNumber,
    inputs: [
      {
        address: fromAddress,
        amount,
        isMine: myAddress === fromAddress,
      },
    ],
    outputs: [
      {
        address: txn.toAddress,
        amount,
        isMine: myAddress === toAddress,
      },
    ],
    extraData: {
      transactionType,
      contractAddress: txn.contractAddress,
      contractDecimals: txn.contractDecimals,
      contractName: txn.contractName,
      contractSymbols: txn.contractSymbols,
    },
  };
  return transaction;
};

const fetchAndParseTransactions = async (params: {
  address: string;
  account: IAccount;
  pageSize: number;
  fromBlock: number;
  pageKey?: string;
  inProcessTransactions?: {
    feeTokenTransfers: services.IStarknetResponseTransaction[];
    amountTokenTransfers: services.IStarknetResponseTransaction[];
  };
}) => {
  const {
    address,
    account,
    pageSize,
    fromBlock,
    pageKey,
    inProcessTransactions,
  } = params;
  const response = await services.getTransactions({
    address,
    assetId: account.assetId,
    contractAddress: STRK_TOKEN_CONTRACT,
    pageSize,
    fromBlock,
    pageKey,
  });

  // The api provides all the token transfers i.e that involves the account address
  // Fees dedcuted in send transactions is returned as a separate token transfer from the actual send transfer
  // So we need to merge them.
  // @TODO: Look for an api which provides the transactions as per our requirements.
  const transactions: ITransaction[] = [];
  const feeTokenTransfers = inProcessTransactions?.feeTokenTransfers ?? [];
  const amountTokenTransfers =
    inProcessTransactions?.amountTokenTransfers ?? [];
  for (const tokenTransfer of response.tokenTransfers) {
    const isFeeTransfer =
      tokenTransfer.toAddress === STRKWARE_SEQUENCER_ADDRESS;
    const primaryTransfers = isFeeTransfer
      ? amountTokenTransfers
      : feeTokenTransfers;
    const secondaryTransfers = isFeeTransfer
      ? feeTokenTransfers
      : amountTokenTransfers;

    const index = primaryTransfers.findIndex(
      item => item.transactionHash === tokenTransfer.transactionHash,
    );

    let transaction: ITransaction | undefined;

    if (index !== -1) {
      transaction = parseTransaction(
        address,
        account,
        tokenTransfer,
        isFeeTransfer ? primaryTransfers[index].value : tokenTransfer.value,
        isFeeTransfer ? tokenTransfer.value : primaryTransfers[index].value,
        'INVOKE_FUNCTION',
      );
      primaryTransfers.splice(index, 1);
    } else {
      secondaryTransfers.push(tokenTransfer);
    }

    if (transaction) transactions.push({ ...transaction });
  }

  const hasMore = response.nextPageKey !== undefined;

  // When there aer no more transaction/tokenTransfers available, parse and push the remaining in process token transfers
  if (!hasMore) {
    // Remaining fee token transfer will be DEPLOY_ACCOUNT
    for (const tokenTransfer of feeTokenTransfers) {
      const transaction = parseTransaction(
        address,
        account,
        tokenTransfer,
        '0',
        tokenTransfer.value,
        'DEPLOY_ACCOUNT',
      );
      transactions.push({ ...transaction });
    }

    // Remaining amount token transfers will be receive transactions
    for (const tokenTransfer of amountTokenTransfers) {
      const transaction = parseTransaction(
        address,
        account,
        tokenTransfer,
        tokenTransfer.value,
        '0',
        'INVOKE_FUNCTION',
      );
      transactions.push({ ...transaction });
    }
  }

  return {
    transactions,
    hasMore,
    nextPageKey: response.nextPageKey,
    inProcessTransactions: {
      feeTokenTransfers,
      amountTokenTransfers,
    },
  };
};

const getAddressDetails: IGetAddressDetails<{
  perPage: number;
  afterBlock?: number;
  updatedBalance?: string;
  nextPageKey?: string;
  inProcessTransactions?: {
    feeTokenTransfers: services.IStarknetResponseTransaction[];
    amountTokenTransfers: services.IStarknetResponseTransaction[];
  };
}> = async ({ db, account, iterationContext }) => {
  const address = account.xpubOrAddress;

  const updatedBalance =
    iterationContext?.updatedBalance ??
    (await services.getBalance(address, STRK_TOKEN_CONTRACT, account.assetId));

  const afterBlock =
    iterationContext?.afterBlock ??
    (await getLatestTransactionBlock(db, {
      accountId: account.__id,
    })) ??
    0;

  const perPage = iterationContext?.perPage ?? PER_PAGE_TXN_LIMIT;

  const transactionDetails = await fetchAndParseTransactions({
    address,
    account,
    pageSize: perPage,
    fromBlock: afterBlock,
    pageKey: iterationContext?.nextPageKey,
    inProcessTransactions: iterationContext?.inProcessTransactions,
  });

  const updatedAccountInfo: Partial<IStarknetAccount> = {
    balance: updatedBalance,
  };

  return {
    hasMore: transactionDetails.hasMore,
    nextIterationContext: {
      perPage,
      afterBlock,
      nextPageKey: transactionDetails.nextPageKey,
      inProcessTransactions: transactionDetails.inProcessTransactions,
    },
    transactions: transactionDetails.transactions,
    updatedAccountInfo,
  };
};

export const syncAccount = (params: ISyncStarknetAccountsParams) =>
  createSyncAccountsObservable({
    ...params,
    getAddressDetails,
  });
