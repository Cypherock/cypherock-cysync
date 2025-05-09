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

import { ISyncIcpAccountsParams } from './types';

import * as services from '../../services';
import {
  IIcpTransactionHistoryResponse,
  IIcpTransactionHistoryResponseTransaction,
} from '../../services/api/types';
import { derivePrincipal, derivePrincipalIdFromPrincipal } from '../../utils';
import { IIcpAccount } from '../types';

const PER_PAGE_TXN_LIMIT = 100;

const parseTransactions = (
  account: IAccount,
  myAddress: string,
  responseTransactions: IIcpTransactionHistoryResponseTransaction[],
): ITransaction[] => {
  const transactions: ITransaction[] = [];
  for (const txn of responseTransactions) {
    const {
      id: txnId,
      operation,
      from: fromAddress,
      to: toAddress,
      amount,
      fee: fees,
      memo,
      timestamp,
    } = txn;

    const transaction: ITransaction = {
      accountId: account.__id ?? '',
      parentAccountId: account.parentAccountId,
      walletId: account.walletId,
      assetId: account.assetId,
      familyId: account.familyId,
      parentAssetId: account.parentAssetId,
      hash: txnId, // tx hash not present, using txn id instead for now
      confirmations: 1,
      fees,
      amount,
      status: TransactionStatusMap.success,
      type:
        myAddress === fromAddress
          ? TransactionTypeMap.send
          : TransactionTypeMap.receive,
      timestamp: new Date(Number(timestamp)).getTime(),
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
    };

    transactions.push({ ...transaction });
  }

  return transactions;
};

const getAddressDetails: IGetAddressDetails<{
  perPage: number;
  beforeTransactionId?: string;
  afterTransactionId?: string;
  updatedBalance?: string;
}> = async ({ account, db, iterationContext }) => {
  const perPage = iterationContext?.perPage ?? PER_PAGE_TXN_LIMIT;

  // Getting afterTransactionId from txn hash instead of block because
  // txn id is a bigint and block is a number. Block value might not be accurate
  let afterTransactionId =
    iterationContext?.afterTransactionId ??
    (await getLatestTransactionHash(db, {
      accountId: account.__id,
      status: TransactionStatusMap.success,
    }));

  afterTransactionId ??= '0';

  let accountIdOrPrincipalId = account.xpubOrAddress;
  let updatedBalance = iterationContext?.updatedBalance;
  let transactionHistoryResponse: IIcpTransactionHistoryResponse;

  const isTokenAccount = account.type === AccountTypeMap.subAccount;
  if (isTokenAccount) {
    accountIdOrPrincipalId = derivePrincipalIdFromPrincipal(
      derivePrincipal((account as IIcpAccount).extraData.publicKey),
    );

    const tokenDetails =
      icpCoinList[account.parentAssetId].tokens[account.assetId];

    updatedBalance ??= await services.getTokenBalance(
      accountIdOrPrincipalId,
      tokenDetails.canisters.ledger,
    );

    transactionHistoryResponse = await services.getTokenTransactions(
      accountIdOrPrincipalId,
      tokenDetails.canisters.index,
      perPage,
      iterationContext?.beforeTransactionId,
      afterTransactionId,
    );
  } else {
    updatedBalance ??= await services.getBalance(accountIdOrPrincipalId);

    transactionHistoryResponse = await services.getTransactions(
      accountIdOrPrincipalId,
      perPage,
      iterationContext?.beforeTransactionId,
      afterTransactionId,
    );
  }

  const updatedAccountInfo: Partial<IIcpAccount> = {
    balance: updatedBalance,
  };

  const transactions = parseTransactions(
    account,
    accountIdOrPrincipalId,
    transactionHistoryResponse.transactions,
  );

  return {
    hasMore: transactionHistoryResponse.hasMore,
    nextIterationContext: {
      perPage,
      beforeTransactionId: transactions[transactions.length - 1]?.hash ?? '0',
      afterTransactionId,
      updatedBalance,
    },
    transactions,
    updatedAccountInfo,
  };
};

export const syncAccount = (params: ISyncIcpAccountsParams) =>
  createSyncAccountsObservable({
    ...params,
    getAddressDetails,
  });
