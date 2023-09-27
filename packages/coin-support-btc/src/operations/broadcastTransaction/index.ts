import {
  getAccountAndCoin,
  insertOrUpdateTransactions,
} from '@cypherock/coin-support-utils';
import { btcCoinList } from '@cypherock/coins';
import { BigNumber } from '@cypherock/cysync-utils';
import {
  ITransaction,
  ITransactionInputOutput,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';

import { IBroadcastBtcTransactionParams } from './types';

import {
  broadcastTransactionToBlockchain,
  getDerivedAddresses,
  IDerivedAddresses,
} from '../../services';
import logger from '../../utils/logger';
import {
  IPreparedBtcTransactionInput,
  IPreparedBtcTransactionOutput,
} from '../transaction';

const mapPreparedTxnInputsOutputsToDb = (
  arr: IPreparedBtcTransactionInput[] | IPreparedBtcTransactionOutput[],
  addresses: IDerivedAddresses,
) => {
  const result: ITransactionInputOutput[] = [];
  const myAddresses = addresses.tokens.map(e => e.name.toLowerCase());

  for (const elem of arr ?? []) {
    result.push({
      address: elem.address,
      amount: elem.value.toString(),
      isMine: myAddresses.includes(elem.address.toLowerCase()),
    });
  }

  return result;
};

export const broadcastTransaction = async (
  params: IBroadcastBtcTransactionParams,
): Promise<ITransaction> => {
  const { db, signedTransaction, transaction } = params;
  const { account, coin } = await getAccountAndCoin(
    db,
    btcCoinList,
    transaction.accountId,
  );

  const addresses = await getDerivedAddresses({
    xpub: account.xpubOrAddress,
    coinId: coin.id,
  });
  const txnHash = await broadcastTransactionToBlockchain(
    signedTransaction,
    coin,
  );

  const parsedTransaction: ITransaction = {
    hash: txnHash,
    fees: transaction.computedData.fee.toString(),
    amount: '0',
    status: TransactionStatusMap.pending,
    type: TransactionTypeMap.receive,
    timestamp: Date.now(),
    blockHeight: -1,
    inputs: mapPreparedTxnInputsOutputsToDb(
      transaction.computedData.inputs,
      addresses,
    ),
    outputs: mapPreparedTxnInputsOutputsToDb(
      transaction.computedData.outputs,
      addresses,
    ),
    confirmations: 0,
    accountId: account.__id,
    walletId: account.walletId,
    assetId: account.assetId,
    parentAssetId: account.parentAssetId,
    familyId: account.familyId,
  };

  const totalInputs = parsedTransaction.inputs.reduce(
    (sum, input) => (input.isMine ? sum.plus(input.amount) : sum),
    new BigNumber(0),
  );

  const totalOutputs = parsedTransaction.outputs.reduce(
    (sum, output) => (output.isMine ? sum.plus(output.amount) : sum),
    new BigNumber(0),
  );

  let amount = totalOutputs.minus(totalInputs);

  parsedTransaction.type = amount.isPositive()
    ? TransactionTypeMap.receive
    : TransactionTypeMap.send;

  if (parsedTransaction.type === TransactionTypeMap.send) {
    amount = amount.abs().minus(parsedTransaction.fees);
  } else {
    logger.warn('Positive amount while sending transaction');
    logger.warn({
      parsedTransaction,
      transaction,
    });
  }

  parsedTransaction.amount = amount.abs().toString();

  await insertOrUpdateTransactions(db, [parsedTransaction]);

  return parsedTransaction;
};
