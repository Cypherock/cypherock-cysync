import {
  getAccountAndCoin,
  insertOrUpdateTransactions,
} from '@cypherock/coin-support-utils';
import { icpCoinList } from '@cypherock/coins';
import { BigNumber } from '@cypherock/cysync-utils';
import {
  ITransaction,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';
import { ISignTxnResult } from '@cypherock/sdk-app-icp';
import { hexToUint8Array } from '@cypherock/sdk-utils';

import { IBroadcastIcpTransactionParams } from './types';

import { broadcastTransactionToBlockchain } from '../../services';
import {
  getCoinSupportDfinityLib,
  getDerEncodedPublicKey,
  prepareReadStateRequest,
  prepareTransferRequest,
} from '../../utils';
import { IPreparedIcpTransaction } from '../transaction';
import { IIcpAccount } from '../types';

const prepareSignedTxn = (
  transaction: IPreparedIcpTransaction,
  account: IIcpAccount,
  signature: ISignTxnResult,
) => {
  const transferRequest = prepareTransferRequest(
    (transaction as IPreparedIcpTransaction).computedData,
    (account as IIcpAccount).extraData.publicKey,
  );

  const { readStateRequest, transferRequestId } =
    prepareReadStateRequest(transferRequest);

  const derPubKey = getDerEncodedPublicKey(
    (account as IIcpAccount).extraData.publicKey,
  );

  const { agent } = getCoinSupportDfinityLib();
  const serializedTransferRequest = agent.Cbor.encode({
    content: transferRequest,
    sender_pubkey: derPubKey,
    sender_sig: hexToUint8Array(signature.transferRequestSignature),
  });

  const signedReadStateRequest = {
    content: readStateRequest,
    sender_pubkey: derPubKey,
    sender_sig: hexToUint8Array(signature.readStateRequestSignature),
  };

  return {
    serializedTransferRequest,
    signedReadStateRequest,
    transferRequestId,
  };
};

export const broadcastTransaction = async (
  params: IBroadcastIcpTransactionParams,
): Promise<ITransaction> => {
  const { db, signedTransaction: signature, transaction } = params;
  const { account } = await getAccountAndCoin(
    db,
    icpCoinList,
    transaction.accountId,
  );

  const myAddress = account.xpubOrAddress;
  const isMine = params.transaction.computedData.output.address === myAddress;

  const txn = prepareSignedTxn(transaction, account as IIcpAccount, signature);

  const result = await broadcastTransactionToBlockchain(txn);

  const parsedTransaction: ITransaction = {
    hash: result,
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
      memo: transaction.computedData.output.memo ?? '0',
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
