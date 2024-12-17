import {
  getAccountAndCoin,
  insertOrUpdateTransactions,
} from '@cypherock/coin-support-utils';
import { starknetCoinList } from '@cypherock/coins';
import {
  ITransaction,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';

import { IBroadcastStarknetTransactionParams } from './types';

import { STRK_TOKEN_CONTRACT } from '../../constants';
import {
  broadcastTransactionToBlockchain,
  prepareInvokeTransaction,
} from '../../services';

const removeHexPrefix = (hex: string) => hex.replace(/^0x/i, '');

const addHexPrefix = (hex: string) => {
  let hexPrefix = '0x';
  if (hex.length % 2) hexPrefix = '0x0';

  return `${hexPrefix}${removeHexPrefix(hex)}`;
};

export const broadcastTransaction = async (
  params: IBroadcastStarknetTransactionParams,
): Promise<ITransaction> => {
  const { db, signedTransaction: signature, transaction } = params;
  const { account, coin } = await getAccountAndCoin(
    db,
    starknetCoinList,
    transaction.accountId,
  );

  const myAddress = account.xpubOrAddress;
  const { address: recipientAddress, amount } = transaction.computedData.output;
  const { nonce } = transaction.staticData;
  const { feeData } = transaction.computedData;
  const isMine = recipientAddress === myAddress;

  const starknetTransaction = prepareInvokeTransaction({
    address: myAddress,
    contractAddress: STRK_TOKEN_CONTRACT,
    recipientAddress,
    amount,
    nonce,
    resourceBounds: feeData.resourceBounds,
    signature,
  });

  const result = await broadcastTransactionToBlockchain({
    transaction: starknetTransaction,
    assetId: coin.id,
  });

  const parsedTransaction: ITransaction = {
    hash: addHexPrefix(result.transactionHash),
    fees: feeData.suggestedMaxFee,
    amount,
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
      contractAddress: STRK_TOKEN_CONTRACT,
    },
  };

  const [addedTxn] = await insertOrUpdateTransactions(db, [parsedTransaction]);

  return addedTxn;
};
