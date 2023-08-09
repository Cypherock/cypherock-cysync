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

import { broadcastTransactionToBlockchain } from '../../services';
import logger from '../../utils/logger';
import {
  IPreparedBtcTransactionInput,
  IPreparedBtcTransactionOutput,
} from '../transaction';

const mapPreparedTxnInputsOutputsToDb = (
  arr: IPreparedBtcTransactionInput[] | IPreparedBtcTransactionOutput[],
  type: 'input' | 'output',
) => {
  const result: ITransactionInputOutput[] = [];

  for (const elem of arr ?? []) {
    result.push({
      address: elem.address,
      amount: elem.value.toString(),
      isMine: type === 'input' ? true : !!elem.derivationPath,
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
      'input',
    ),
    outputs: mapPreparedTxnInputsOutputsToDb(
      transaction.computedData.outputs,
      'output',
    ),
    confirmations: 0,
    accountId: account.__id,
    walletId: account.walletId,
    assetId: account.assetId,
    familyId: account.familyId,
  };

  const totalInputs = transaction.computedData.inputs.reduce(
    (sum, input) => sum.plus(input.value),
    new BigNumber(0),
  );

  const totalOutputs = transaction.computedData.outputs.reduce(
    (sum, output) => (!output.derivationPath ? sum.plus(output.value) : sum),
    new BigNumber(0),
  );

  const amount = totalOutputs.minus(totalInputs);

  parsedTransaction.type = amount.isNegative()
    ? TransactionTypeMap.send
    : TransactionTypeMap.receive;

  if (amount.isPositive()) {
    logger.warn('Positive amount while sending');
    logger.warn({
      parsedTransaction,
      transaction,
    });
  }

  parsedTransaction.amount = amount.abs().toString();

  await insertOrUpdateTransactions(db, [parsedTransaction]);

  return parsedTransaction;
};
