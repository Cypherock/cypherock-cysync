import {
  createSyncAccountsObservable,
  createSyncPriceHistoriesObservable,
  createSyncPricesObservable,
  getLatestTransactionBlock,
  IGetAddressDetails,
  insertAccountIfNotExists,
} from '@cypherock/coin-support-utils';
import { coinList, ITronCoinInfo, ITronTrc20Token } from '@cypherock/coins';
import { BigNumber } from '@cypherock/cysync-utils';
import {
  AccountTypeMap,
  IAccount,
  IDatabase,
  ITransaction,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';
import { lastValueFrom } from 'rxjs';

import { ISyncTronAccountsParams, ITronTrc20TokenAccount } from './types';

import {
  getAccountsTransactionsByAddress,
  getContractBalance,
} from '../../services';
import { TronTransaction } from '../../services/validators';
import logger from '../../utils/logger';
import { ITronAccount } from '../types';

const PER_PAGE_TXN_LIMIT = 100;

interface GetTransactionParserParams {
  address: string;
  account: IAccount;
}

const onNewAccounts = (newAccounts: IAccount[], db: IDatabase) => {
  for (const newAccount of newAccounts) {
    lastValueFrom(
      syncAccount({
        db,
        accountId: newAccount.__id ?? '',
      }),
    ).catch(error => {
      logger.error('Error in syncing tron token account');
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
      }),
    ).catch(error => {
      logger.error('Error in syncing tron token prices');
      logger.error(error);
    });

    lastValueFrom(
      createSyncPriceHistoriesObservable({
        db,
        getCoinIds,
      }),
    ).catch(error => {
      logger.error('Error in syncing tron token price histories');
      logger.error(error);
    });
  }
};

const getTransactionParser = (
  params: GetTransactionParserParams,
): ((transaction: any) => ITransaction) => {
  const myAddress = params.address;
  const { account } = params;

  return (transaction: TronTransaction): ITransaction => {
    const fromAddr = transaction.fromAddress;
    const toAddr = transaction.toAddress;
    const amount = transaction.value;
    const fees = new BigNumber(transaction.fees).toFixed();
    const timestamp = (transaction.blockTime ?? 0) * 1000;
    const hash = transaction.txid
      ? transaction.txid.replace('0x', '')
      : transaction.txid;

    const txn: ITransaction = {
      hash,
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
        myAddress.toLowerCase() === fromAddr.toLowerCase()
          ? TransactionTypeMap.send
          : TransactionTypeMap.receive,
      timestamp,
      blockHeight: transaction.blockHeight,
      inputs: [
        {
          address: fromAddr,
          amount,
          isMine: myAddress.toLowerCase() === fromAddr.toLowerCase(),
        },
      ],
      outputs: [
        {
          address: toAddr,
          amount,
          isMine: myAddress.toLowerCase() === toAddr.toLowerCase(),
        },
      ],
      extraData: {},
    };

    return txn;
  };
};

const getTokenObject = (
  account: IAccount,
  tokenAddress: string,
): ITronTrc20Token | undefined => {
  const coin = coinList[account.assetId] as ITronCoinInfo;
  return Object.values(coin.tokens).find(
    token => token.address.toLowerCase() === tokenAddress.toLowerCase(),
  );
};

const getTronTokenAccount = (account: IAccount, tokenObj: ITronTrc20Token) => {
  const tokenAccount: ITronTrc20TokenAccount = {
    walletId: account.walletId,
    assetId: tokenObj.id,
    familyId: account.familyId,
    parentAccountId: account.__id ?? '',
    parentAssetId: account.parentAssetId,
    type: AccountTypeMap.subAccount,
    name: tokenObj.name,
    derivationPath: account.derivationPath,
    unit: undefined,
    xpubOrAddress: account.xpubOrAddress,
    balance: '0',
    extraData: {
      contractAddress: tokenObj.address,
    },
    isHidden: false,
  };

  return tokenAccount;
};

interface GetTokenTransactionParserReturnParams {
  tokenTransactions: ITransaction[];
  newTokenAccounts: IAccount[];
}
const getTokenTransactionParser = (
  params: GetTransactionParserParams,
  db: IDatabase,
): ((transaction: any) => Promise<GetTokenTransactionParserReturnParams>) => {
  const myAddress = params.address;
  const { account } = params;

  return async (
    transaction: TronTransaction,
  ): Promise<GetTokenTransactionParserReturnParams> => {
    if (transaction.tokenTransfers === undefined)
      return {
        tokenTransactions: [],
        newTokenAccounts: [],
      };

    const tokenTransactions: ITransaction[] = [];
    const newTokenAccounts: IAccount[] = [];

    for (let i = 0; i < transaction.tokenTransfers.length; i += 1) {
      const tokenTransfer = transaction.tokenTransfers[i];
      const tokenObj = getTokenObject(account, tokenTransfer.token);

      if (tokenObj === undefined) {
        logger.warn('Token not available in cySync', {
          decimals: tokenTransfer.decimals,
          name: tokenTransfer.name,
          symbol: tokenTransfer.symbol,
          token: tokenTransfer.token,
          type: tokenTransfer.type,
        });
        continue;
      }

      const tokenAccount: ITronTrc20TokenAccount = getTronTokenAccount(
        account,
        tokenObj,
      );
      const { account: newTokenAccount, isInserted } =
        await insertAccountIfNotExists(db, tokenAccount);

      if (isInserted) {
        newTokenAccounts.push(newTokenAccount);
      }

      const fromAddr = tokenTransfer.from;
      const toAddr = tokenTransfer.to;
      const amount = tokenTransfer.value;
      const fees = new BigNumber(transaction.fees).toFixed();
      const timestamp = (transaction.blockTime ?? 0) * 1000;
      const hash = transaction.txid
        ? transaction.txid.replace('0x', '')
        : transaction.txid;

      const txn: ITransaction = {
        hash,
        accountId: newTokenAccount.__id ?? '',
        walletId: newTokenAccount.walletId,
        assetId: newTokenAccount.assetId,
        parentAssetId: newTokenAccount.parentAssetId,
        familyId: newTokenAccount.familyId,
        amount,
        fees,
        confirmations: 1,
        status:
          transaction.tronTXReceipt.status === 1
            ? TransactionStatusMap.success
            : TransactionStatusMap.failed,
        type:
          myAddress.toLowerCase() === fromAddr.toLowerCase()
            ? TransactionTypeMap.send
            : TransactionTypeMap.receive,
        timestamp,
        blockHeight: transaction.blockHeight,
        inputs: [
          {
            address: fromAddr,
            amount,
            isMine: myAddress.toLowerCase() === fromAddr.toLowerCase(),
          },
        ],
        outputs: [
          {
            address: toAddr,
            amount,
            isMine: myAddress.toLowerCase() === toAddr.toLowerCase(),
          },
        ],
        extraData: {},
      };
      tokenTransactions.push(txn);
    }
    return { tokenTransactions, newTokenAccounts };
  };
};

const getAddressDetails: IGetAddressDetails<{
  page: number;
  perPage: number;
  afterBlock?: number;
}> = async ({ db, account, iterationContext }) => {
  const afterBlock =
    iterationContext?.afterBlock ??
    (await getLatestTransactionBlock(db, {
      accountId: account.__id,
    }));

  const isTokenAccount = account.type === AccountTypeMap.subAccount;
  const page = iterationContext?.page ?? 1;
  const perPage = iterationContext?.perPage ?? PER_PAGE_TXN_LIMIT;

  if (isTokenAccount) {
    const tokenBalance = await getContractBalance({
      address: account.xpubOrAddress,
      assetId: account.assetId,
      parentAssetId: account.parentAssetId,
    });

    return {
      hasMore: false,
      nextIterationContext: {
        page: page + 1,
        perPage,
        afterBlock,
      },
      transactions: [],
      updatedAccountInfo: {
        balance: tokenBalance,
      },
    };
  }

  const response = await getAccountsTransactionsByAddress({
    address: account.xpubOrAddress,
    page: iterationContext?.page ?? page,
    pageSize: iterationContext?.perPage ?? perPage,
    from: afterBlock,
  });

  const updatedAccountInfo: Partial<ITronAccount> = {
    balance: response.balance,
  };

  const transactionParser = getTransactionParser({
    address: account.xpubOrAddress,
    account,
  });

  const tokenTransactionParser = getTokenTransactionParser(
    {
      address: account.xpubOrAddress,
      account,
    },
    db,
  );

  // filter out token transactions
  const transactions: ITransaction[] = [];
  const newAccounts: IAccount[] = [];

  for (let i = 0; i < response.transactions.length; i += 1) {
    const rawTransaction = response.transactions[i];
    const normalTransactionParsed: ITransaction =
      transactionParser(rawTransaction);
    if (rawTransaction.tokenTransfers) {
      const { tokenTransactions, newTokenAccounts } =
        await tokenTransactionParser(rawTransaction);
      transactions.push(...tokenTransactions);
      newAccounts.push(...newTokenAccounts);

      // Add hidden fees transaction to parent account if token is transfered
      if (normalTransactionParsed.type === TransactionTypeMap.send) {
        normalTransactionParsed.type = TransactionTypeMap.hidden;

        // Fee is deducted on failed transactions
        if (normalTransactionParsed.status === TransactionStatusMap.failed) {
          normalTransactionParsed.status = TransactionStatusMap.success;
        }
      }
    }
    transactions.push(normalTransactionParsed);
  }

  onNewAccounts(newAccounts, db);

  const hasMore = Boolean(
    response.page && response.totalPages && response.totalPages > response.page,
  );

  return {
    hasMore,
    nextIterationContext: {
      page: page + 1,
      perPage,
      afterBlock,
    },
    transactions,
    updatedAccountInfo,
  };
};

export const syncAccount = (params: ISyncTronAccountsParams) =>
  createSyncAccountsObservable({
    ...params,
    getAddressDetails,
  });
