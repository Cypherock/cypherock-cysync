import { assert, BigNumber } from '@cypherock/cysync-utils';
import {
  ITransactionInputOutput,
  IAccount,
  ITransaction,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';

import { IBlockbookTransaction } from './api';

import logger from '../../utils/logger';

const mapBlockbookTxnInputsToDb = (
  transaction: IBlockbookTransaction,
  myAddresses: string[],
): ITransactionInputOutput[] => {
  const result: ITransactionInputOutput[] = [];

  for (const input of transaction.vin ?? []) {
    if (input.addresses.length <= 0) {
      logger.warn('No addresses found in blockbook transaction input');
      logger.warn({ ...input, id: transaction.txid });
      continue;
    }

    const address = input.addresses[0];
    result.push({
      address,
      amount: input.value,
      isMine: myAddresses.includes(address.toLowerCase()),
    });
  }

  return result;
};

const mapBlockbookTxnOutputsToDb = (
  transaction: IBlockbookTransaction,
  myAddresses: string[],
): ITransactionInputOutput[] => {
  const result: ITransactionInputOutput[] = [];

  for (const output of transaction.vout ?? []) {
    if (output.addresses.length <= 0) {
      logger.warn('No addresses found in blockbook transaction output');
      logger.warn({ ...output, id: transaction.txid });
      continue;
    }

    const address = output.addresses[0];
    result.push({
      address,
      amount: output.value,
      isMine: myAddresses.includes(address.toLowerCase()),
    });
  }

  return result;
};

export const mapBlockbookTxnToDb = (
  account: IAccount,
  transactions: IBlockbookTransaction[] = [],
  myAddresses: string[] = [],
): ITransaction[] => {
  assert(account.__id, 'Account id is not defined');

  if (!transactions) {
    return [];
  }

  const result: ITransaction[] = [];

  for (const transaction of transactions) {
    const parsedTransaction = {
      hash: transaction.txid,
      fees: transaction.fees,
      amount: transaction.valueIn,
      status:
        transaction.confirmations > 1
          ? TransactionStatusMap.success
          : TransactionStatusMap.pending,
      type: TransactionTypeMap.receive,
      timestamp: transaction.blockTime * 1000,
      blockHeight: transaction.blockHeight,
      inputs: mapBlockbookTxnInputsToDb(transaction, myAddresses),
      outputs: mapBlockbookTxnOutputsToDb(transaction, myAddresses),
      confirmations: transaction.confirmations,
      accountId: account.__id,
      walletId: account.walletId,
      assetId: account.assetId,
      parentAssetId: account.assetId,
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
    }

    parsedTransaction.amount = amount.abs().toString();

    result.push(parsedTransaction);
  }

  return result;
};
