import {
  getAccountAndCoin,
  insertOrUpdateTransactions,
} from '@cypherock/coin-support-utils';
import { stellarCoinList } from '@cypherock/coins';
import { BigNumber } from '@cypherock/cysync-utils';
import {
  ITransaction,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';

import { IBroadcastStellarTransactionParams } from './types';

import { broadcastTransactionToBlockchain } from '../../services';
import { deriveAddress } from '../../utils';
import { StellarMemoType } from '../transaction';

// Helper to ensure memo is in a serializable format
const formatMemoForStorage = (memo?: {
  type: StellarMemoType;
  value?: string;
}) => {
  if (!memo || memo.type === StellarMemoType.NONE) {
    return undefined;
  }

  return {
    type: memo.type,
    value: memo.value ?? '',
  };
};

export const broadcastTransaction = async (
  params: IBroadcastStellarTransactionParams,
): Promise<ITransaction> => {
  const { db, signedTransaction, transaction } = params;
  const { account, coin } = await getAccountAndCoin(
    db,
    stellarCoinList,
    transaction.accountId,
  );

  const myAddress = deriveAddress(account.xpubOrAddress);
  const isMine = params.transaction.computedData.output.address === myAddress;
  const { isCreateAccount } = params.transaction.computedData.output;

  const result = await broadcastTransactionToBlockchain(
    signedTransaction,
    coin.id,
  );

  const parsedTransaction: ITransaction = {
    hash: result.hash || '',
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
      isCreateAccount,
      memo: formatMemoForStorage(transaction.computedData.output.memo),
      ledger: result.ledger,
      resultXdr: result.result_xdr,
      resultCodes: result.result_codes,
      operationType: isCreateAccount ? 'createAccount' : 'payment',
      description: isCreateAccount ? 'Account Creation' : 'Payment',
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
