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

import { BigNumber } from '@cypherock/cysync-utils';
import lodash from 'lodash';
import { ISyncNearAccountsParams } from './types';
import { NearTransaction } from '../../validators';

const PER_PAGE_TXN_LIMIT = 50;

interface GetTransactionParserParams {
  address: string;
  account: IAccount;
}

const getTransactionParser = (
  _params: GetTransactionParserParams,
): ((transaction: NearTransaction) => ITransaction) => {
  const myAddress = _params.address;
  const { account } = _params;

  return (transaction: NearTransaction): ITransaction => {
    const fromAddr = transaction.sender;
    const toAddr = transaction.receiver;
    const amount = new BigNumber(transaction.amount).toFixed();
    // const fees = new BigNumber(
    //   transaction.outcomes_agg.transaction_fee,
    // ).toFixed();
    const timestamp = new BigNumber(transaction.timestamp)
      .dividedBy(1_000_000)
      .toNumber();

    const txn: ITransaction = {
      hash: transaction.transaction_id /* @todo: transaction_hash is not present in the NearTransaction type */,
      accountId: account.__id ?? '',
      walletId: account.walletId,
      assetId: account.parentAssetId,
      parentAssetId: account.parentAssetId,
      familyId: account.familyId,
      amount,
      fees: '0' /* @todo: fees is not present in the NearTransaction type */,
      confirmations: 1,
      status: transaction.status
        ? TransactionStatusMap.success
        : TransactionStatusMap.failed,
      type:
        myAddress === fromAddr
          ? TransactionTypeMap.send
          : TransactionTypeMap.receive,
      timestamp,
      blockHeight: transaction.block_height,
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
        transaction_id: transaction.transaction_id,
      },
    };

    return txn;
  };
};

const getAddressDetails: IGetAddressDetails<{
  offset: number;
  limit: number;
  transactionsInDb: ITransaction[];
}> = async ({ db, account, iterationContext }) => {
  const offset = iterationContext?.offset ?? 0;
  const limit = iterationContext?.limit ?? PER_PAGE_TXN_LIMIT;
  const transactionsInDb =
    iterationContext?.transactionsInDb ??
    (await db.transaction.getAll({
      accountId: account.__id,
      assetId: account.parentAssetId,
    }));

  const response = await getTransactions({
    address: account.xpubOrAddress,
    assetId: account.parentAssetId,
    offset: iterationContext?.offset ?? offset,
    limit: iterationContext?.limit ?? limit,
  });

  const transactionParser = getTransactionParser({
    address: account.xpubOrAddress,
    account,
  });

  const transactions = response.transactions.map(transactionParser);
  const hasMore =
    lodash.intersectionBy(transactionsInDb, transactions, 'hash').length > 0;

  return {
    hasMore,
    nextIterationContext: {
      offset: offset + limit,
      limit,
      transactionsInDb,
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
