import {
  createSyncAccountsObservable,
  getLatestTransactionBlock,
  getUniqueAccountQuery,
  IGetAddressDetails,
  insertAccountIfNotExists,
  updateAccountByQuery,
} from '@cypherock/coin-support-utils';
import { BigNumber } from '@cypherock/cysync-utils';
import {
  AccountTypeMap,
  IAccount,
  IDatabase,
  ITransaction,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';

import { ISyncTronAccountsParams, ITronTrc20TokenAccount } from './types';

import {
  getAccountsTransactionsByAddress,
  getTokensDetailByAddress,
} from '../../services';
import { TronTransaction } from '../../services/validators';
import { coinList, ITronCoinInfo, ITronTrc20Token } from '@cypherock/coins';
import logger from '../../utils/logger';

const PER_PAGE_TXN_LIMIT = 100;

interface GetTransactionParserParams {
  address: string;
  account: IAccount;
}

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

const getTokenTransactionParser = (
  params: GetTransactionParserParams,
  db: IDatabase,
): ((transaction: any) => Promise<ITransaction[]>) => {
  const myAddress = params.address;
  const { account } = params;

  return async (transaction: TronTransaction): Promise<ITransaction[]> => {
    if (transaction.tokenTransfers === undefined) return [];

    const tokenTransactions: ITransaction[] = [];

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
        logger.info('Tron Token Account Created', { tokenAccount });
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
    return tokenTransactions;
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

  const page = iterationContext?.page ?? 1;
  const perPage = iterationContext?.perPage ?? PER_PAGE_TXN_LIMIT;

  const updatedAccountInfo = {
    balance: account.balance,
    extraData: {
      ...(account.extraData ?? {}),
    },
  };

  const response = await getAccountsTransactionsByAddress({
    address: account.xpubOrAddress,
    page: iterationContext?.page ?? page,
    pageSize: iterationContext?.perPage ?? perPage,
    from: afterBlock,
  });

  updatedAccountInfo.balance = response.balance;

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

  for (let i = 0; i < response.transactions.length; i += 1) {
    const transaction = response.transactions[i];
    if (transaction.tokenTransfers) {
      const tokenTransactions = await tokenTransactionParser(transaction);
      transactions.push(...tokenTransactions);
    } else {
      transactions.push(transactionParser(transaction));
    }
  }

  const hasMore = Boolean(
    response.page && response.totalPages && response.totalPages > response.page,
  );

  // update token balances
  if (!hasMore) {
    const tokens = await getTokensDetailByAddress(account.xpubOrAddress);
    for (let i = 0; i < tokens.length; i += 1) {
      const [[contractAddress, tokenBalance]] = Object.entries(tokens[i]);
      const tokenObj = getTokenObject(account, contractAddress);
      if (!tokenObj) continue;
      const tokenAccountQuery = getUniqueAccountQuery(
        getTronTokenAccount(account, tokenObj),
      );
      await updateAccountByQuery(db, tokenAccountQuery, {
        balance: tokenBalance,
      });
    }
  }

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
