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

import { IBroadcastStarknetDeployAccountTransactionParams } from './types';

import { STRKWARE_SEQUENCER_ADDRESS } from '../../constants';
import {
  broadcastDeployAccountTransactionToBlockchain,
  prepareDeployAccountTransaction,
} from '../../services';

const removeHexPrefix = (hex: string) => hex.replace(/^0x/i, '');

const addHexPrefix = (hex: string) => {
  let hexPrefix = '0x';
  if (hex.length % 2) hexPrefix = '0x0';

  return `${hexPrefix}${removeHexPrefix(hex)}`;
};

export const broadcastDeployAccountTransaction = async (
  params: IBroadcastStarknetDeployAccountTransactionParams,
): Promise<ITransaction> => {
  const { db, signedTransaction: signature, transaction } = params;
  const { account, coin } = await getAccountAndCoin(
    db,
    starknetCoinList,
    transaction.accountId,
  );

  const myAddress = account.xpubOrAddress;
  const { feeData, nonce } = transaction.computedData;

  const deployAccountTransaction = prepareDeployAccountTransaction({
    assetId: account.assetId,
    salt: account.extraData?.salt,
    nonce,
    resourceBounds: feeData.resourceBounds,
    signature,
  });

  const result = await broadcastDeployAccountTransactionToBlockchain({
    transaction: deployAccountTransaction,
    assetId: coin.id,
  });

  /**
   * @todo: Fetch the transaction details using the result.transactionHash
   * Update ITransaction with the actual values from the details fetched
   * And if transaction status is SUCCEEDED, update the account balance as well
   */

  const parsedTransaction: ITransaction = {
    hash: addHexPrefix(result.transactionHash),
    fees: feeData.suggestedMaxFee,
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
        address: STRKWARE_SEQUENCER_ADDRESS,
        amount: '0',
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
    remarks: ['Deploy Account'],
    extraData: {},
  };

  const [addedTxn] = await insertOrUpdateTransactions(db, [parsedTransaction]);

  return addedTxn;
};
