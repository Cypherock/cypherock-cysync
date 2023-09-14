import { insertAccountIfNotExists } from '@cypherock/coin-support-utils';
import { coinList, IEvmCoinInfo } from '@cypherock/coins';
import { BigNumber } from '@cypherock/cysync-utils';
import {
  IAccount,
  IDatabase,
  ITransaction,
  TransactionStatusMap,
  TransactionTypeMap,
  AccountTypeMap,
} from '@cypherock/db-interfaces';

import { IEvmContractTransactionItem } from '../api';

export const mapContractTransactionForDb = async (params: {
  db: IDatabase;
  account: IAccount;
  transaction: IEvmContractTransactionItem;
}): Promise<ITransaction[] | undefined> => {
  const { account, transaction, db } = params;
  const coin = coinList[account.assetId] as IEvmCoinInfo;

  const txns: ITransaction[] = [];

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
    let tokenAccount: IAccount = {
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
    };

    tokenAccount = await insertAccountIfNotExists(db, tokenAccount);

    const txn: ITransaction = {
      hash: transaction.hash,
      accountId: tokenAccount.__id ?? '',
      parentAccountId: account.__id ?? '',
      walletId: account.walletId,
      assetId: tokenObj.id,
      parentAssetId: account.assetId,
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
    };

    txns.push(txn);
  }

  // When a token is sent, the transaction fee is deducted from ETH
  if (myAddress === fromAddr) {
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
      timestamp: new Date(parseInt(transaction.timeStamp, 10) * 1000).getTime(),
      blockHeight: new BigNumber(transaction.blockNumber).toNumber(),
      inputs: [],
      outputs: [],
    });
  }

  return txns;
};

export const mapContractTransactionsForDb = async (params: {
  db: IDatabase;
  account: IAccount;
  transactions: IEvmContractTransactionItem[];
}): Promise<ITransaction[]> => {
  const { account, transactions, db } = params;

  const txns: ITransaction[] = [];

  for (const txn of transactions) {
    const mappedTxn = await mapContractTransactionForDb({
      account,
      transaction: txn,
      db,
    });
    if (mappedTxn) txns.push(...mappedTxn);
  }

  return txns;
};
