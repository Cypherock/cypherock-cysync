import {
  createSyncAccountsObservable,
  createSyncPriceHistoriesObservable,
  createSyncPricesObservable,
  createTransactionId,
  getLatestTransactionBlock,
  IGetAddressDetails,
  insertAccountIfNotExists,
} from '@cypherock/coin-support-utils';
import {
  cantonCoinList,
  coinList,
  ICantonCoinInfo,
  ICantonToken,
} from '@cypherock/coins';
import {
  AccountTypeMap,
  IAccount,
  IDatabase,
  IKeyValueStore,
  ITransaction,
  TransactionStatus,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';
import { lastValueFrom } from 'rxjs';

import { ISyncCantonAccountsParams } from './types';

import * as services from '../../services';
import logger from '../../utils/logger';
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

const checkIsCantonCoinInstrument = (
  account: IAccount,
  instrument: services.ICantonInstrument,
): boolean => {
  const coin = coinList[account.assetId] as ICantonCoinInfo;
  return (
    coin.instrument.id.toLowerCase() === instrument.id.toLowerCase() &&
    coin.instrument.admin.toLowerCase() === instrument.admin.toLowerCase()
  );
};

const getTokenObject = (
  account: IAccount,
  instrument: services.ICantonInstrument,
): ICantonToken | undefined => {
  const coin = coinList[account.assetId] as ICantonCoinInfo;
  return Object.values(coin.tokens).find(
    token =>
      token.instrument.id.toLowerCase() === instrument.id.toLowerCase() &&
      token.instrument.admin.toLowerCase() === instrument.admin.toLowerCase(),
  );
};

const getCantonTokenAccount = (
  account: IAccount,
  tokenObj: ICantonToken,
): IAccount => ({
  walletId: account.walletId,
  assetId: tokenObj.id,
  familyId: account.familyId,
  parentAccountId: account.__id ?? '',
  parentAssetId: account.parentAssetId,
  type: AccountTypeMap.subAccount,
  name: tokenObj.name,
  derivationPath: account.derivationPath,
  unit: tokenObj.units[0].abbr,
  xpubOrAddress: account.xpubOrAddress,
  balance: '0',
  extraData: {
    instrument: tokenObj.instrument,
    publicKey: account.extraData?.publicKey,
  },
  isHidden: false,
});

const onNewAccounts = (
  newAccounts: IAccount[],
  db: IDatabase,
  currency: string,
) => {
  for (const newAccount of newAccounts) {
    lastValueFrom(
      syncAccount({
        db,
        accountId: newAccount.__id ?? '',
        currency,
      }),
    ).catch(error => {
      logger.error('Error in syncing canton token account');
      logger.error(error);
    });
  }

  if (newAccounts.length > 0) {
    const getCoinIds = async () =>
      newAccounts.map(e => ({
        parentAssetId: e.parentAssetId,
        assetId: e.assetId,
      }));

    lastValueFrom(
      createSyncPricesObservable({
        db,
        getCoinIds,
        currency,
      }),
    ).catch(error => {
      logger.error('Error in syncing canton token prices');
      logger.error(error);
    });

    lastValueFrom(
      createSyncPriceHistoriesObservable({
        db,
        getCoinIds,
        currency,
      }),
    ).catch(error => {
      logger.error('Error in syncing canton token price histories');
      logger.error(error);
    });
  }
};

const getAccountToUseAndNewAccountIfNeeded = async (
  db: IDatabase,
  account: IAccount,
  instrument: services.ICantonInstrument,
): Promise<{ accountToUse?: IAccount; newAccount?: IAccount }> => {
  const isCantonCoinInstrument = checkIsCantonCoinInstrument(
    account,
    instrument,
  );

  if (isCantonCoinInstrument) {
    return { accountToUse: account };
  }

  const tokenObj = getTokenObject(account, instrument);

  if (!tokenObj) {
    logger.warn('Token instrument not available in cySync', {
      instrument,
    });
    return { accountToUse: undefined };
  }

  const tokenAccount = getCantonTokenAccount(account, tokenObj);

  const { account: newTokenAccount, isInserted } =
    await insertAccountIfNotExists(db, tokenAccount);

  return {
    accountToUse: newTokenAccount,
    newAccount: isInserted ? newTokenAccount : undefined,
  };
};

const removeObsoleteTransactions = async (
  db: IDatabase,
  account: IAccount,
  pendingTransactions: ITransaction[],
) => {
  const existingPendingTransactions = await db.transaction.getAll({
    accountId: account.__id,
    status: TransactionStatusMap.pending,
  });

  const existingPendingTokenTransactions = await db.transaction.getAll({
    parentAccountId: account.__id,
    status: TransactionStatusMap.pending,
  });

  // also delete existing expired transactions if they are not in the pending transactions list received from the server
  const existingExpiredTransactions = await db.transaction.getAll({
    accountId: account.__id,
    status: TransactionStatusMap.expired,
  });

  const existingExpiredTokenTransactions = await db.transaction.getAll({
    parentAccountId: account.__id,
    status: TransactionStatusMap.expired,
  });

  const existingTransactions = [
    ...existingPendingTransactions,
    ...existingPendingTokenTransactions,
    ...existingExpiredTransactions,
    ...existingExpiredTokenTransactions,
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
    parentAccountId: account.parentAccountId,
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
    parentAccountId: account.parentAccountId,
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
  currency: string;
}) => {
  const { partyId, account, db, keyDB, currency } = params;
  let { afterOffset } = params;

  afterOffset ??= account?.extraData?.latestTransactionOffset;
  afterOffset ??= await getLatestTransactionBlock(db, {
    accountId: account.__id,
  });
  afterOffset ??= 0;

  const response = await services.getTransactions(
    {
      partyId,
      fetchAll: true,
      afterOffset,
    },
    keyDB,
  );

  const transactions: ITransaction[] = [];
  const newAccounts: IAccount[] = [];

  for (const rawTransaction of response.transactions) {
    const { accountToUse, newAccount } =
      await getAccountToUseAndNewAccountIfNeeded(
        db,
        account,
        rawTransaction.instrumentId,
      );

    if (!accountToUse) {
      continue;
    }

    if (newAccount) {
      newAccounts.push(newAccount);
    }

    const transaction = parseTransaction(partyId, accountToUse, rawTransaction);

    transactions.push({ ...transaction });
  }

  const { hasMore, nextOffset } = response;

  if (!hasMore) {
    const pendingTransactions = await services.getPendingTransactions(
      {
        partyId,
        fetchAll: true,
      },
      keyDB,
    );

    const resultPendingTxns: ITransaction[] = [];
    for (const rawTransaction of pendingTransactions) {
      const { accountToUse, newAccount } =
        await getAccountToUseAndNewAccountIfNeeded(
          db,
          account,
          rawTransaction.instrumentId,
        );

      if (!accountToUse) {
        continue;
      }

      if (newAccount) {
        newAccounts.push(newAccount);
      }
      const transaction = parsePendingTransaction(
        partyId,
        accountToUse,
        rawTransaction,
      );
      resultPendingTxns.push({ ...transaction });
    }
    transactions.push(...resultPendingTxns);

    await removeObsoleteTransactions(db, account, resultPendingTxns);
  }

  onNewAccounts(newAccounts, db, currency);

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
}> = async ({ db, account, iterationContext, currency, keyDB }) => {
  const partyId = account.xpubOrAddress;

  let updatedTransferPreApprovalStatus =
    iterationContext?.updatedTransferPreApprovalStatus;

  let instrument: services.ICantonInstrument;
  const isTokenAccount = account.type === AccountTypeMap.subAccount;
  if (isTokenAccount) {
    const tokenDetails =
      cantonCoinList[account.parentAssetId].tokens[account.assetId];
    instrument = tokenDetails.instrument;
    updatedTransferPreApprovalStatus ??= false;
  } else {
    instrument = cantonCoinList[account.assetId].instrument;
    updatedTransferPreApprovalStatus ??=
      await services.isTransferPreApprovalEnabled(partyId, instrument, keyDB);
  }

  const updatedBalance =
    iterationContext?.updatedBalance ??
    (await services.getBalance(partyId, instrument, keyDB));

  const { transactions, hasMore, nextOffset } = isTokenAccount
    ? { transactions: [], hasMore: false, nextOffset: undefined }
    : await fetchAndParseTransactions({
        partyId,
        account,
        afterOffset: iterationContext?.afterOffset,
        db,
        keyDB,
        currency,
      });

  let latestTransactionOffset = nextOffset;
  latestTransactionOffset ??=
    transactions?.[transactions.length - 1]?.blockHeight;
  latestTransactionOffset ??= iterationContext?.afterOffset;
  latestTransactionOffset ??= account.extraData?.latestTransactionOffset;

  const updatedAccountInfo: Partial<ICantonAccount> = {
    balance: updatedBalance,
    extraData: {
      ...account.extraData,
      isTransferPreApprovalEnabled: updatedTransferPreApprovalStatus,
      latestTransactionOffset,
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
