import {
  getAccountAndCoin,
  insertOrUpdateTransactions,
} from '@cypherock/coin-support-utils';
import { icpCoinList } from '@cypherock/coins';
import { BigNumber } from '@cypherock/cysync-utils';
import {
  AccountTypeMap,
  ITransaction,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';
import { ISignTxnResult } from '@cypherock/sdk-app-icp';
import { hexToUint8Array } from '@cypherock/sdk-utils';

import { IBroadcastIcpTransactionParams } from './types';

import { ICP_LEDGER_CANISTER_ID } from '../../constants';
import { broadcastTransactionToBlockchain } from '../../services';
import {
  derivePrincipal,
  getCoinSupportDfinityLib,
  getDerEncodedPublicKey,
  prepareReadStateRequest,
  prepareTokenTransferRequest,
  prepareTransferRequest,
} from '../../utils';
import { IPreparedIcpTransaction } from '../transaction';
import { IIcpAccount } from '../types';

const prepareSignedTxn = (
  transaction: IPreparedIcpTransaction,
  account: IIcpAccount,
  signature: ISignTxnResult,
) => {
  const isTokenAccount = account.type === AccountTypeMap.subAccount;

  const transferRequest = isTokenAccount
    ? prepareTokenTransferRequest(
        transaction.computedData,
        account.extraData.publicKey,
        icpCoinList[account.parentAssetId].tokens[account.assetId].canisters
          .ledger,
      )
    : prepareTransferRequest(
        transaction.computedData,
        account.extraData.publicKey,
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

  const serializedTransaction = agent.Cbor.encode({
    serializedTransferRequest,
    signedReadStateRequest,
    transferRequestId,
  });

  return Buffer.from(serializedTransaction).toString('base64');
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

  const isTokenAccount = account.type === AccountTypeMap.subAccount;

  let myAddress = account.xpubOrAddress;
  if (isTokenAccount) {
    const { principal } = getCoinSupportDfinityLib();
    myAddress = principal.Principal.from(
      derivePrincipal((account as IIcpAccount).extraData.publicKey),
    ).toText();
  }
  const isMine = params.transaction.computedData.output.address === myAddress;

  const txn = prepareSignedTxn(transaction, account as IIcpAccount, signature);

  const result = await broadcastTransactionToBlockchain(
    txn,
    isTokenAccount,
    isTokenAccount
      ? icpCoinList[account.parentAssetId].tokens[account.assetId].canisters
          .ledger
      : ICP_LEDGER_CANISTER_ID,
  );

  let memo: string | undefined;
  if (!isTokenAccount) {
    memo = transaction.computedData.output.memo ?? '0';
  }

  const parsedTransaction: ITransaction = {
    hash: result.txnId,
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
      memo,
      operation: 'transfer',
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
