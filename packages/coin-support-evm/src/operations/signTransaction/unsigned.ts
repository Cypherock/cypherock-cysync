import { IEvmCoinInfo } from '@cypherock/coins';
import { IAccount } from '@cypherock/db-interfaces';
import { ISignTxnParams } from '@cypherock/sdk-app-evm';
import { assert } from '@cypherock/sdk-utils';

import { getTransactionCount } from '../../services';
import { getCoinSupportEthersLib } from '../../utils';
import { IPreparedEvmTransaction } from '../transaction';

export const prepareUnsignedTxn = async (
  transaction: IPreparedEvmTransaction,
  coin: IEvmCoinInfo,
  account: IAccount,
): Promise<ISignTxnParams['txn']> => {
  const nonce =
    transaction.userInputs.nonce ??
    (await getTransactionCount(account.xpubOrAddress, coin.id));
  const txn = getCoinSupportEthersLib().Transaction.from({
    // eslint-disable-next-line radix
    nonce: parseInt(nonce.toString()),
    to: transaction.computedData.output.address,
    data: transaction.computedData.data,
    gasLimit: transaction.computedData.gasLimit,
    gasPrice: transaction.computedData.gasPrice,
    value: transaction.computedData.output.amount,
    chainId: coin.chain,
    // currently firmware only supports EIP-155 transaction types
    type: 0,
  });

  assert(
    txn.unsignedSerialized,
    new Error('Failed to prepare unsigned transaction'),
  );
  return txn.unsignedSerialized;
};
