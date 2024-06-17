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
import {
  CreateSmartContractSchema,
  TransferAssetContractSchema,
  TransferContractSchema,
  TronNormalTransaction,
  TronTransaction,
} from '../../services/validators';

const PER_PAGE_TXN_LIMIT = 100;

interface GetTransactionParserParams {
  address: string;
  account: IAccount;
}

const getContractProperties = (transaction: TronNormalTransaction) => {
  let toAddr: string | undefined;
  let fromAddr: string | undefined;
  let amount: number | undefined;

  const transferContract = TransferContractSchema.safeParse(
    transaction.raw_data.contract[0],
  );
  if (transferContract.success) {
    toAddr = transferContract.data.parameter.value.to_address;
    fromAddr = transferContract.data.parameter.value.owner_address;
    amount = transferContract.data.parameter.value.amount;
  }

  const transferAssetContract = TransferAssetContractSchema.safeParse(
    transaction.raw_data.contract[0],
  );
  if (transferAssetContract.success) {
    toAddr = transferAssetContract.data.parameter.value.to_address;
    fromAddr = transferAssetContract.data.parameter.value.owner_address;
    amount = transferAssetContract.data.parameter.value.amount;
  }

  const createSmartContract = CreateSmartContractSchema.safeParse(
    transaction.raw_data.contract[0],
  );
  if (createSmartContract.success) {
    toAddr = createSmartContract.data.parameter.value.owner_address;
    fromAddr = createSmartContract.data.parameter.value.owner_address;
    amount = createSmartContract.data.parameter.value.call_token_value;
  }

  return {
    toAddr: toAddr ?? '',
    fromAddr: fromAddr ?? '',
    amount: new BigNumber(amount ?? 0).toFixed(),
  };
};

const getTransactionParser = (
  _params: GetTransactionParserParams,
): ((transaction: any) => ITransaction) => {
  const myAddress = _params.address;
  const { account } = _params;

  return (transaction: TronTransaction): ITransaction => {
    const isInternalTransaction = 'internal_tx_id' in transaction;

    if (isInternalTransaction) {
      return {
        hash: transaction.tx_id,
        accountId: account.__id ?? '',
        walletId: account.walletId,
        assetId: account.parentAssetId,
        parentAssetId: account.parentAssetId,
        familyId: account.familyId,
        amount: '0',
        fees: '0',
        confirmations: 1,
        status: transaction.data.rejected
          ? TransactionStatusMap.failed
          : TransactionStatusMap.success,
        type:
          myAddress === transaction.from_address
            ? TransactionTypeMap.send
            : TransactionTypeMap.receive,
        timestamp: transaction.block_timestamp,
        blockHeight: 0,
        inputs: [
          {
            address: transaction.from_address,
            amount: '0',
            isMine: myAddress === transaction.from_address,
          },
        ],
        outputs: [
          {
            address: transaction.to_address,
            amount: '0',
            isMine: myAddress === transaction.to_address,
          },
        ],
        extraData: {
          internal_tx_id: transaction.internal_tx_id,
          note: transaction.data.note,
        },
      };
    }

    const { fromAddr, toAddr, amount } = getContractProperties(transaction);
    const fees = new BigNumber(transaction.net_fee).toFixed();
    const timestamp = new BigNumber(transaction.block_timestamp)
      .dividedBy(1_000_000)
      .toNumber();

    const txn: ITransaction = {
      hash: transaction.txID,
      accountId: account.__id ?? '',
      walletId: account.walletId,
      assetId: account.parentAssetId,
      parentAssetId: account.parentAssetId,
      familyId: account.familyId,
      amount,
      fees,
      confirmations: 1,
      status: transaction.ret.every(ret => ret.contractRet === 'SUCCESS')
        ? TransactionStatusMap.success
        : TransactionStatusMap.failed,
      type:
        myAddress === fromAddr
          ? TransactionTypeMap.send
          : TransactionTypeMap.receive,
      timestamp,
      blockHeight: transaction.blockNumber,
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
  fingerprint?: string;
  transactionsInDb: ITransaction[];
}> = async ({ db, account, iterationContext }) => {
  const fingerprint = iterationContext?.fingerprint ?? undefined;
  const transactionsInDb =
    iterationContext?.transactionsInDb ??
    (await db.transaction.getAll({
      accountId: account.__id,
      assetId: account.parentAssetId,
    }));

  const response = await getAccountsTransactionsByAddress(
    account.xpubOrAddress,
    fingerprint,
    PER_PAGE_TXN_LIMIT,
  );

  const transactionParser = getTransactionParser({
    address: account.xpubOrAddress,
    account,
  });

  const transactions = response.data.map(transactionParser);
  const hasMore =
    lodash.intersectionBy(transactionsInDb, transactions, 'hash').length > 0;

  return {
    hasMore,
    nextIterationContext: {
      fingerprint: response.meta.fingerprint,
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
