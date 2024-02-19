import { insertAccountIfNotExists } from '@cypherock/coin-support-utils';
import { coinList, IEvmCoinInfo } from '@cypherock/coins';
import { BigNumber } from '@cypherock/cysync-utils';
import {
  AccountTypeMap,
  IAccount,
  IDatabase,
  ITransaction,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';

import { formatAddress } from '../../operations';
import { IEvmErc20TokenAccount } from '../../operations/types';
import { IEvmContractTransactionItem } from '../api';

export const mapContractTransactionForDb = async (params: {
  db: IDatabase;
  account: IAccount;
  transaction: IEvmContractTransactionItem;
  existingTransactions: ITransaction[];
}): Promise<{
  transactions: ITransaction[];
  newAccounts: IAccount[];
}> => {
  const { account, transaction, db, existingTransactions } = params;
  const coin = coinList[account.assetId] as IEvmCoinInfo;

  const txns: ITransaction[] = [];
  const newAccounts: IAccount[] = [];

  const tokenObj = Object.values(coin.tokens).find(
    e => transaction.contractAddress.toLowerCase() === e.address.toLowerCase(),
  );

  const myAddress = account.xpubOrAddress.toLowerCase();
  const fromAddr = transaction.from.toLowerCase();
  const toAddr = transaction.to.toLowerCase();
  const selfTransfer = fromAddr === toAddr;
  const amount = String(transaction.value || 0);
  const fees = new BigNumber(transaction.gasPrice || 0).multipliedBy(
    new BigNumber(transaction.gasUsed || 0),
  );

  // Only add if it exists in our coin list
  if (tokenObj) {
    let tokenAccount: IEvmErc20TokenAccount = {
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

    const insertedResult = await insertAccountIfNotExists(db, tokenAccount);
    tokenAccount = insertedResult.account as IEvmErc20TokenAccount;

    if (insertedResult.isInserted) {
      newAccounts.push(tokenAccount);
    }

    const txn: ITransaction = {
      hash: transaction.hash,
      accountId: tokenAccount.__id ?? '',
      parentAccountId: account.__id ?? '',
      walletId: account.walletId,
      assetId: tokenObj.id,
      parentAssetId: account.parentAssetId,
      familyId: account.familyId,
      amount: selfTransfer ? '0' : amount,
      fees: fees.toString(),
      confirmations: new BigNumber(transaction.confirmations).toNumber() || 0,
      status: TransactionStatusMap.success,
      type:
        myAddress === fromAddr
          ? TransactionTypeMap.send
          : TransactionTypeMap.receive,
      timestamp: new Date(parseInt(transaction.timeStamp, 10) * 1000).getTime(),
      blockHeight: new BigNumber(transaction.blockNumber).toNumber(),
      inputs: [
        {
          address: formatAddress({
            address: fromAddr,
            coinId: account.parentAssetId,
          }),
          amount,
          isMine: myAddress === fromAddr,
        },
      ],
      outputs: [
        {
          address: formatAddress({
            address: toAddr,
            coinId: account.parentAssetId,
          }),
          amount,
          isMine: myAddress === toAddr,
        },
      ],
    };

    txns.push(txn);
  }

  // When a token is sent, the transaction fee is deducted from ETH
  if (myAddress === fromAddr) {
    const existingFeesTxn = existingTransactions.find(
      e =>
        e.hash === transaction.hash &&
        [TransactionTypeMap.send, TransactionTypeMap.hidden].includes(e.type) &&
        e.assetId === account.assetId &&
        e.parentAssetId === account.parentAssetId,
    );

    if (!existingFeesTxn) {
      txns.push({
        hash: transaction.hash,
        accountId: account.__id ?? '',
        walletId: account.walletId,
        assetId: account.assetId,
        parentAssetId: account.parentAssetId,
        familyId: account.familyId,
        amount: '0',
        fees: fees.toString(),
        confirmations: new BigNumber(transaction.confirmations).toNumber() || 0,
        status: TransactionStatusMap.success,
        type: TransactionTypeMap.hidden,
        timestamp: new Date(
          parseInt(transaction.timeStamp, 10) * 1000,
        ).getTime(),
        blockHeight: new BigNumber(transaction.blockNumber).toNumber(),
        inputs: [],
        outputs: [],
      });
    }
  }

  return { transactions: txns, newAccounts };
};

export const mapContractTransactionsForDb = async (params: {
  db: IDatabase;
  account: IAccount;
  transactions: IEvmContractTransactionItem[];
  existingTransactions: ITransaction[];
}): Promise<{ transactions: ITransaction[]; newAccounts: IAccount[] }> => {
  const { account, transactions, db, existingTransactions } = params;

  const txns: ITransaction[] = [];
  const newAccountsList: IAccount[] = [];

  for (const txn of transactions) {
    const result = await mapContractTransactionForDb({
      account,
      transaction: txn,
      db,
      existingTransactions,
    });
    txns.push(...result.transactions);
    newAccountsList.push(...result.newAccounts);
  }

  return { transactions: txns, newAccounts: newAccountsList };
};
