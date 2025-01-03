import {
  getAccountAndCoin,
  insertOrUpdateTransactions,
} from '@cypherock/coin-support-utils';
import { starknetCoinList } from '@cypherock/coins';
import { sleep } from '@cypherock/cysync-utils';
import {
  ITransaction,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';

import { IBroadcastStarknetDeployAccountTransactionParams } from './types';

import {
  STRK_TOKEN_CONTRACT,
  STRKWARE_SEQUENCER_ADDRESS,
} from '../../constants';
import {
  broadcastDeployAccountTransactionToBlockchain,
  getBalance,
  prepareDeployAccountTransaction,
} from '../../services';
import { addHexPrefix } from '../../utils/addHexPrefix';

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

  /**
   * Updating the account balance(balance - fees) after deploy account
   * as we need to proceed to send txn
   * Waiting for some time (10s) for the deploy account transaction
   * to be included in a block so that we get the updated balance
   * @todo: Check if we can somehow get the updated balance immediately
   * as well as the deploy account txn status so that we can be sure
   * how to proceed further and don't have to wait
   */
  await sleep(10000);
  const balance = await getBalance(
    myAddress,
    STRK_TOKEN_CONTRACT,
    account.assetId,
    'pending',
  );
  await db.account.update({ __id: account.__id }, { balance });

  return addedTxn;
};
