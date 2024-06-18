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
import { getAccountsTransactionsByAddress } from '../../services';

import { BigNumber } from '@cypherock/cysync-utils';
import lodash from 'lodash';
import { ISyncTronAccountsParams } from './types';
import { TronTransaction } from '../../services/validators';

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

  return (transaction: TronTransaction): ITransaction => {
    const fromAddr = transaction.fromAddress;
    const toAddr = transaction.toAddress;
    const amount = transaction.value;
    const fees = new BigNumber(transaction.fees).toFixed();
    const timestamp = new BigNumber(transaction.blockTime)
      .dividedBy(1_000_000)
      .toNumber();

    const txn: ITransaction = {
      hash: transaction.txid,
      accountId: account.__id ?? '',
      walletId: account.walletId,
      assetId: account.parentAssetId,
      parentAssetId: account.parentAssetId,
      familyId: account.familyId,
      amount,
      fees,
      confirmations: 1,
      status:
        transaction.tronTXReceipt.status === 1
          ? TransactionStatusMap.success
          : TransactionStatusMap.failed,
      type:
        myAddress === fromAddr
          ? TransactionTypeMap.send
          : TransactionTypeMap.receive,
      timestamp,
      blockHeight: transaction.blockHeight,
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
      extraData: {},
    };

    return txn;
  };
};

const getAddressDetails: IGetAddressDetails<{
  page: number;
  perPage: number;
  transactionsInDb: ITransaction[];
}> = async ({ db, account, iterationContext }) => {
  const page = iterationContext?.page ?? 1;
  const perPage = iterationContext?.perPage ?? PER_PAGE_TXN_LIMIT;
  const transactionsInDb =
    iterationContext?.transactionsInDb ??
    (await db.transaction.getAll({
      accountId: account.__id,
      assetId: account.parentAssetId,
    }));

  const response = await getAccountsTransactionsByAddress(
    account.xpubOrAddress,
    iterationContext?.page ?? page,
    iterationContext?.perPage ?? perPage,
  );

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
      page: page + 1,
      perPage,
      transactionsInDb,
    },
    transactions,
    updatedAccountInfo: {},
  };
};

export const syncAccount = (params: ISyncTronAccountsParams) =>
  createSyncAccountsObservable({
    ...params,
    getAddressDetails,
  });
