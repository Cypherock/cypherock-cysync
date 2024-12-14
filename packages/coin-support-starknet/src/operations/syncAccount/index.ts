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

import { ISyncStarknetAccountsParams } from './types';

import { STRK_TOKEN_CONTRACT } from '../../constants';
import * as services from '../../services';
import { IStarknetAccount } from '../types';

const PER_PAGE_TXN_LIMIT = 100;

const parseTransaction = (
  address: string,
  account: IAccount,
  txn: services.IStarknetResponseTransaction,
): ITransaction => {
  const myAddress = address;
  const { fromAddress, toAddress, value: amount } = txn;

  const transaction: ITransaction = {
    accountId: account.__id ?? '',
    walletId: account.walletId,
    assetId: account.assetId,
    familyId: account.familyId,
    parentAssetId: account.parentAssetId,
    hash: txn.transactionHash,
    confirmations: 1,
    fees: txn.transactionFee,
    amount,
    status:
      txn.status === 'SUCCEEDED'
        ? TransactionStatusMap.success
        : TransactionStatusMap.failed,
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
        address: toAddress,
        amount,
        isMine: myAddress === toAddress,
      },
    ],
    extraData: {
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
}) => {
  const { address, account } = params;
  const response = await services.getTransactions({
    address,
    assetId: account.assetId,
    contractAddress: STRK_TOKEN_CONTRACT,
    pageSize: params.pageSize,
    fromBlock: params.fromBlock,
  });

  const transactions: ITransaction[] = [];
  let latestBlockNumber = 0;
  for (const tx of response.transactions) {
    const transaction = parseTransaction(address, account, tx);
    transactions.push({ ...transaction });
    latestBlockNumber = Math.max(latestBlockNumber, tx.blockNumber);
  }

  return {
    transactions,
    hasMore: response.hasMore,
    latestBlockNumber,
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
  });

  const updatedAccountInfo: Partial<IStarknetAccount> = {
    balance: updatedBalance,
  };

  return {
    hasMore: transactionDetails.hasMore,
    nextIterationContext: {
      perPage,
      afterBlock: transactionDetails.latestBlockNumber,
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
