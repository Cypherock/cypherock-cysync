import {
  createSyncAccountsObservable,
  IGetAddressDetails,
} from '@cypherock/coin-support-utils';
import {
  IAccount,
  ITransaction,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';
import { getTransactions } from '../../services';

import { ISyncNearAccountsParams } from './types';
import { BigNumber } from '@cypherock/cysync-utils';

const PER_PAGE_TXN_LIMIT = 100;

interface GetTransactionParserParams {
  address: string;
  account: IAccount;
}

const getTransactionParser = (
  _params: GetTransactionParserParams,
): ((transaction: any) => ITransaction) => {
  const myAddress = _params.address;
  const { account } = _params;

  return (transaction: any): ITransaction => {
    const fromAddr = transaction.predecessor_account_id;
    const toAddr = transaction.receiver_account_id;
    const amount = new BigNumber(transaction.actions_agg.deposit).toFixed();
    const fees = new BigNumber(
      transaction.outcomes_agg.transaction_fee,
    ).toFixed();
    const timestamp = new BigNumber(transaction.block_timestamp)
      .dividedBy(1_000_000)
      .toNumber();

    const txn: ITransaction = {
      hash: transaction.transaction_hash,
      accountId: account.__id ?? '',
      walletId: account.walletId,
      assetId: account.parentAssetId,
      parentAssetId: account.parentAssetId,
      familyId: account.familyId,
      amount,
      fees,
      confirmations: 1,
      status: transaction.outcomes.status
        ? TransactionStatusMap.success
        : TransactionStatusMap.failed,
      type:
        myAddress === fromAddr
          ? TransactionTypeMap.send
          : TransactionTypeMap.receive,
      timestamp,
      blockHeight: transaction.block.block_height,
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
      extraData: {
        receiptId: transaction.receipt_id,
        includedInBlockHash: transaction.included_in_block_hash,
        actions: transaction.actions,
        logs: transaction.logs,
      },
    };

    return txn;
  };
};

const getAddressDetails: IGetAddressDetails<{
  page: number;
  perPage: number;
  order: 'desc' | 'asc';
}> = async ({ db, account, iterationContext }) => {
  let page = iterationContext?.page ?? 1;
  const order = iterationContext?.order ?? 'asc';
  const perPage = iterationContext?.perPage ?? PER_PAGE_TXN_LIMIT;

  if (iterationContext === undefined) {
    const allSavedTransactions = await db.transaction.getAll({
      accountId: account.__id,
      assetId: account.parentAssetId,
    });
    const transactionCount = allSavedTransactions.length;
    page = Math.floor(transactionCount / perPage) + 1;
  }

  const response = await getTransactions({
    address: account.xpubOrAddress,
    assetId: account.parentAssetId,
    page: iterationContext?.page ?? page,
    perPage: iterationContext?.perPage ?? perPage,
    order: iterationContext?.order ?? order,
  });

  const transactionParser = getTransactionParser({
    address: account.xpubOrAddress,
    account,
  });
  const transactions = response.transactions.map(transactionParser);
  await db.transaction.insert(transactions);

  return {
    hasMore: response.hasMore,
    nextIterationContext: {
      order,
      page: page + 1,
      perPage,
    },
    transactions,
    updatedAccountInfo: {},
  };
};

export const syncAccount = (params: ISyncNearAccountsParams) =>
  createSyncAccountsObservable({
    ...params,
    getAddressDetails,
  });
