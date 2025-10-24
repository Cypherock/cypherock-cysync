import {
  getAccountAndCoin,
  insertOrUpdateTransactions,
} from '@cypherock/coin-support-utils';
import { siaCoinList } from '@cypherock/coins';
import {
  ITransaction,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';

import { IBroadcastSiaTransactionParams } from './types';

import { broadcastBlockchainTransaction } from '../../services';

const scToHastings = (sc: string): string => {
  const parts = sc.split('.');
  const wholePart = parts[0] || '0';
  const decimalPart = (parts[1] || '').padEnd(24, '0').substring(0, 24);
  return (
    BigInt(wholePart) * BigInt('1000000000000000000000000') +
    BigInt(decimalPart)
  ).toString();
};

export const broadcastTransaction = async (
  params: IBroadcastSiaTransactionParams,
): Promise<ITransaction> => {
  const { db, signedTransaction, transaction } = params;
  const { account } = await getAccountAndCoin(
    db,
    siaCoinList,
    transaction.accountId,
  );

  const myAddress = account.xpubOrAddress;
  const { selectedUtxos, output, fees } = transaction.computedData;
  const publicKey = account.extraData?.publicKey as string;

  const sendAmountHastings = BigInt(scToHastings(output.amount));
  const feeHastings = BigInt(scToHastings(fees));

  const totalInputHastings = selectedUtxos.reduce(
    (sum, utxo) => sum + BigInt(utxo.value),
    BigInt(0),
  );

  const outputs: Array<{ address: string; value: string }> = [
    {
      address: output.address,
      value: sendAmountHastings.toString(),
    },
  ];

  const changeHastings = totalInputHastings - sendAmountHastings - feeHastings;
  if (changeHastings > BigInt(0)) {
    outputs.push({
      address: myAddress,
      value: changeHastings.toString(),
    });
  }

  const selectedUtxoIds = selectedUtxos.map(utxo => utxo.id);

  const result = await broadcastBlockchainTransaction(
    selectedUtxoIds,
    outputs,
    feeHastings.toString(),
    signedTransaction,
    publicKey,
    myAddress,
  );

  console.log(result);

  const parsedTransaction: ITransaction = {
    hash: '',
    fees,
    amount: output.amount,
    status: TransactionStatusMap.pending,
    type: TransactionTypeMap.send,
    timestamp: Date.now(),
    blockHeight: -1,
    inputs: [
      {
        address: myAddress,
        amount: output.amount,
        isMine: true,
      },
    ],
    outputs: [
      {
        address: output.address,
        amount: output.amount,
        isMine: false,
      },
    ],
    confirmations: 0,
    accountId: account.__id,
    walletId: account.walletId,
    assetId: account.assetId,
    parentAssetId: account.parentAssetId,
    familyId: account.familyId,
    parentAccountId: account.parentAccountId,
  };

  const [addedTxn] = await insertOrUpdateTransactions(db, [parsedTransaction]);

  return addedTxn;
};
