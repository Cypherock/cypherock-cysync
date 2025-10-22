import {
  getAccountAndCoin,
  insertOrUpdateTransactions,
} from '@cypherock/coin-support-utils';
import { cantonCoinList } from '@cypherock/coins';
import { BigNumber } from '@cypherock/cysync-utils';
import {
  ITransaction,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';
import { hexToUint8Array, uint8ArrayToBase64 } from '@cypherock/sdk-utils';

import { IBroadcastCantonTransactionParams } from './types';

import { broadcastTransactionToBlockchain } from '../../services';

export const broadcastTransaction = async (
  params: IBroadcastCantonTransactionParams,
): Promise<ITransaction> => {
  const { db, signedTransaction, transaction } = params;
  const { account } = await getAccountAndCoin(
    db,
    cantonCoinList,
    transaction.accountId,
  );

  const myAddress = account.xpubOrAddress;
  const isMine = params.transaction.computedData.output.address === myAddress;

  const result = await broadcastTransactionToBlockchain(
    uint8ArrayToBase64(hexToUint8Array(signedTransaction)),
    uint8ArrayToBase64(hexToUint8Array(account.extraData?.publicKey ?? '')),
    transaction.computedData.preparedTransaction,
  );

  const parsedTransaction: ITransaction = {
    hash: result.updateId,
    fees: transaction.computedData.fees,
    amount: '0',
    status: TransactionStatusMap.pending,
    type: TransactionTypeMap.send,
    timestamp: Date.now(),
    blockHeight: -1,
    inputs: [
      {
        address: myAddress,
        amount: '0',
        isMine: true,
      },
    ],
    outputs: [
      {
        ...params.transaction.userInputs.outputs[0],
        isMine,
      },
    ],
    confirmations: 0,
    accountId: account.__id,
    walletId: account.walletId,
    assetId: account.assetId,
    parentAssetId: account.parentAssetId,
    familyId: account.familyId,
    parentAccountId: account.parentAccountId,
    remarks: [transaction.userInputs.outputs[0].remarks ?? ''],
    extraData: {},
  };

  const amount = parsedTransaction.outputs.reduce(
    (sum, output) => (output.isMine ? sum : sum.plus(output.amount)),
    new BigNumber(0),
  );
  parsedTransaction.amount = amount.abs().toString();
  parsedTransaction.inputs[0].amount = amount.abs().toString();

  const [addedTxn] = await insertOrUpdateTransactions(db, [parsedTransaction]);

  return addedTxn;
};
