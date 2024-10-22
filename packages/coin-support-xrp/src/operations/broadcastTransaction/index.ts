import {
  getAccountAndCoin,
  insertOrUpdateTransactions,
} from '@cypherock/coin-support-utils';
import { xrpCoinList } from '@cypherock/coins';
import { BigNumber } from '@cypherock/cysync-utils';
import {
  ITransaction,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';

import { IBroadcastXrpTransactionParams } from './types';

import { broadcastTransactionToBlockchain } from '../../services';
import { deriveAddress } from '../../utils';

export const broadcastTransaction = async (
  params: IBroadcastXrpTransactionParams,
): Promise<ITransaction> => {
  const { db, signedTransaction, transaction } = params;
  const { account, coin } = await getAccountAndCoin(
    db,
    xrpCoinList,
    transaction.accountId,
  );

  const myAddress = deriveAddress(account.xpubOrAddress);
  const isMine = params.transaction.computedData.output.address === myAddress;

  const result = await broadcastTransactionToBlockchain(
    signedTransaction,
    coin.id,
  );

  const parsedTransaction: ITransaction = {
    hash: result.tx_json.hash,
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
    extraData: {
      destinationTag: result.tx_json.DestinationTag,
      flags: result.tx_json.Flags,
      sequence: result.tx_json.Sequence,
      lastLedgerSequence: result.tx_json.LastLedgerSequence,
    },
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
