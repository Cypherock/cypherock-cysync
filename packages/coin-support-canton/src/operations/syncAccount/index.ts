import {
  createSyncAccountsObservable,
  createTransactionId,
  getLatestTransactionBlock,
  IGetAddressDetails,
} from '@cypherock/coin-support-utils';
import {
  IAccount,
  IDatabase,
  IKeyValueStore,
  ITransaction,
  TransactionStatus,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';

import { ISyncCantonAccountsParams } from './types';

import * as services from '../../services';
import { ICantonAccount } from '../types';

enum CantonTransactionSubType {
  ACCEPT = 'TransferInstruction_Accept',
  REJECT = 'TransferInstruction_Reject',
  WITHDRAW = 'TransferInstruction_Withdraw',
  DIRECT_TRANSFER = 'TransferFactory_Transfer',
}

const CantonTransactionChoiceMap = {
  [CantonTransactionSubType.ACCEPT]: 'Accept',
  [CantonTransactionSubType.REJECT]: 'Reject',
  [CantonTransactionSubType.WITHDRAW]: 'Withdraw',
  [CantonTransactionSubType.DIRECT_TRANSFER]: 'Direct Transfer',
} as const;

enum CantonTransactionStatus {
  COMPLETED = 'TransferInstructionResult_Completed',
  FAILED = 'TransferInstructionResult_Failed',
  PENDING = 'TransferInstructionResult_Pending',
}

const CantonTransactionStatusMap = {
  [CantonTransactionStatus.COMPLETED]: TransactionStatusMap.success,
  [CantonTransactionStatus.FAILED]: TransactionStatusMap.failed,
  [CantonTransactionStatus.PENDING]: TransactionStatusMap.pending,
} as const;

const transactionChoiceToStatusMap = {
  [CantonTransactionSubType.ACCEPT]: TransactionStatusMap.success,
  [CantonTransactionSubType.REJECT]: TransactionStatusMap.rejected,
  [CantonTransactionSubType.WITHDRAW]: TransactionStatusMap.cancelled,
  [CantonTransactionSubType.DIRECT_TRANSFER]: TransactionStatusMap.success,
} as const;

const removeObsoleteTransactions = async (
  db: IDatabase,
  account: IAccount,
  pendingTransactions: ITransaction[],
) => {
  const existingPendingTransactions = await db.transaction.getAll({
    accountId: account.__id,
    status: TransactionStatusMap.pending,
  });

  // also delete existing expired transactions if they not in the pending transactions list received from the server
  const existingExpiredTransactions = await db.transaction.getAll({
    accountId: account.__id,
    status: TransactionStatusMap.expired,
  });

  const existingTransactions = [
    ...existingPendingTransactions,
    ...existingExpiredTransactions,
  ];

  const currentPendingTransactionIds = await Promise.all(
    pendingTransactions.map(txn => createTransactionId(txn)),
  );

  for (const existing of existingTransactions) {
    if (!currentPendingTransactionIds.includes(existing.__id)) {
      await db.transaction.remove({ __id: existing.__id });
    }
  }
};

const parseTransaction = (
  partyId: string,
  account: IAccount,
  txn: services.ICantonResponseTransaction,
): ITransaction => {
  const myPartyId = partyId;
  const fromPartyId = txn.sender;
  const toPartyId = txn.receiver;
  const { fees = '0', amount } = txn;

  let status: TransactionStatus = TransactionStatusMap.failed;
  if (CantonTransactionStatusMap[txn.status as CantonTransactionStatus]) {
    status =
      CantonTransactionStatusMap[txn.status as CantonTransactionStatus] ??
      TransactionStatusMap.failed;
  }
  if (status === TransactionStatusMap.failed && txn.choice) {
    status =
      transactionChoiceToStatusMap[txn.choice as CantonTransactionSubType] ??
      TransactionStatusMap.failed;
  }

  const transaction: ITransaction = {
    accountId: account.__id ?? '',
    walletId: account.walletId,
    assetId: account.assetId,
    familyId: account.familyId,
    parentAssetId: account.parentAssetId,
    hash: txn.updateId,
    confirmations: 1,
    fees,
    amount,
    status,
    type:
      myPartyId === fromPartyId
        ? TransactionTypeMap.send
        : TransactionTypeMap.receive,
    timestamp: new Date(txn.recordTime).getTime(),
    blockHeight: txn.offset,
    inputs: [
      {
        address: fromPartyId,
        amount,
        isMine: myPartyId === fromPartyId,
      },
    ],
    outputs: [
      {
        address: toPartyId,
        amount,
        isMine: myPartyId === toPartyId,
      },
    ],
    extraData: {
      cantonType: txn.type,
      cantonStatus: txn.status,
      choice:
        CantonTransactionChoiceMap[txn.choice as CantonTransactionSubType],
      memo: txn.memo ? txn.memo : undefined,
      instrument: txn.instrumentId,
    },
  };
  return transaction;
};

const parsePendingTransaction = (
  partyId: string,
  account: IAccount,
  txn: services.ICantonPendingResponseTransaction,
): ITransaction => {
  const myPartyId = partyId;
  const fromPartyId = txn.sender;
  const toPartyId = txn.receiver;
  const { fees = '0', amount } = txn;

  const status: TransactionStatus =
    new Date(txn.executeBefore).getTime() < Date.now()
      ? TransactionStatusMap.expired
      : TransactionStatusMap.pending;

  const transaction: ITransaction = {
    accountId: account.__id ?? '',
    walletId: account.walletId,
    assetId: account.assetId,
    familyId: account.familyId,
    parentAssetId: account.parentAssetId,
    hash: txn.updateId,
    confirmations: 1,
    fees,
    amount,
    status,
    type:
      myPartyId === fromPartyId
        ? TransactionTypeMap.send
        : TransactionTypeMap.receive,
    timestamp: new Date(txn.recordTime).getTime(),
    blockHeight: txn.offset,
    inputs: [
      {
        address: fromPartyId,
        amount,
        isMine: myPartyId === fromPartyId,
      },
    ],
    outputs: [
      {
        address: toPartyId,
        amount,
        isMine: myPartyId === toPartyId,
      },
    ],
    extraData: {
      cantonStatus: txn.status,
      memo: txn.memo ? txn.memo : undefined,
      startDate: txn.requestedAt,
      expiryDate: txn.executeBefore,
      instrument: txn.instrumentId,
      contractId: txn.contractId,
      templateId: txn.templateId,
    },
  };
  return transaction;
};

const fetchAndParseTransactions = async (params: {
  partyId: string;
  account: IAccount;
  afterOffset?: number;
  db: IDatabase;
  keyDB?: IKeyValueStore;
}) => {
  const { partyId, account, afterOffset, db, keyDB } = params;

  const response = await services.getTransactions(
    {
      partyId,
      afterOffset,
    },
    keyDB,
  );

  const transactions: ITransaction[] = [];
  for (const rawTransaction of response.transactions) {
    const transaction = parseTransaction(partyId, account, rawTransaction);

    transactions.push({ ...transaction });
  }

  const { hasMore, nextOffset } = response;

  if (!hasMore) {
    const pendingTransactions = await services.getPendingTransactions(
      {
        partyId,
      },
      keyDB,
    );

    const resultPendingTxns: ITransaction[] = [];
    for (const rawTransaction of pendingTransactions) {
      const transaction = parsePendingTransaction(
        partyId,
        account,
        rawTransaction,
      );
      resultPendingTxns.push({ ...transaction });
    }
    transactions.push(...resultPendingTxns);

    await removeObsoleteTransactions(db, account, resultPendingTxns);
  }

  return {
    transactions,
    hasMore,
    nextOffset,
  };
};

const getAddressDetails: IGetAddressDetails<{
  afterOffset?: number;
  updatedBalance?: string;
  updatedTransferPreApprovalStatus?: boolean;
}> = async ({ db, account, iterationContext, keyDB }) => {
  const partyId = account.xpubOrAddress;

  const updatedBalance =
    iterationContext?.updatedBalance ??
    (await services.getBalance(partyId, keyDB));

  const updatedTransferPreApprovalStatus =
    iterationContext?.updatedTransferPreApprovalStatus ??
    (await services.isTransferPreApprovalEnabled(partyId, keyDB));

  const afterOffset =
    iterationContext?.afterOffset ??
    (await getLatestTransactionBlock(db, {
      accountId: account.__id,
    })) ??
    0;

  const { transactions, hasMore, nextOffset } = await fetchAndParseTransactions(
    {
      partyId,
      account,
      afterOffset,
      db,
      keyDB,
    },
  );

  const updatedAccountInfo: Partial<ICantonAccount> = {
    balance: updatedBalance,
    extraData: {
      ...account.extraData,
      isTransferPreApprovalEnabled: updatedTransferPreApprovalStatus,
    },
  };

  return {
    hasMore,
    nextIterationContext: {
      afterOffset: nextOffset,
      updatedBalance,
      updatedTransferPreApprovalStatus,
    },
    transactions,
    updatedAccountInfo,
  };
};

export const syncAccount = (params: ISyncCantonAccountsParams) =>
  createSyncAccountsObservable({
    ...params,
    getAddressDetails,
  });
