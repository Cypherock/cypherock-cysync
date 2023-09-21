import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { evmCoinList, ICoinInfo } from '@cypherock/coins';

import { IPrepareEvmTransactionParams } from './types';

import { estimateGasLimit } from '../../services';
import { IPreparedEvmTransaction } from '../transaction';
import { validateAddress } from '../validateAddress';
import { assert, BigNumber } from '@cypherock/cysync-utils';

const validateAddresses = (
  params: IPrepareEvmTransactionParams,
  coin: ICoinInfo,
) => {
  const outputAddressValidation: boolean[] = [];

  for (const output of params.txn.userInputs.outputs) {
    let isValid = true;

    if (
      output.address &&
      !validateAddress({ address: output.address, coinId: coin.id })
    ) {
      isValid = false;
    }

    outputAddressValidation.push(isValid);
  }

  return outputAddressValidation;
};

export const prepareTransaction = async (
  params: IPrepareEvmTransactionParams,
): Promise<IPreparedEvmTransaction> => {
  const { accountId, db, txn } = params;
  const { account, coin } = await getAccountAndCoin(db, evmCoinList, accountId);

  assert(
    txn.userInputs.outputs.length === 1,
    new Error('Evm transaction requires 1 output'),
  );

  const gasLimit =
    txn.userInputs.gasLimit ??
    (await estimateGasLimit(coin.id, {
      from: account.xpubOrAddress,
      to: account.xpubOrAddress,
      value: '0',
      data: '0x',
    }));
  const gasPrice = txn.userInputs.gasPrice ?? txn.staticData.averageGasPrice;
  const outputsAddresses = validateAddresses(params, coin);
  const fee = new BigNumber(gasLimit).multipliedBy(gasPrice);
  const hasEnoughBalance = new BigNumber(account.balance)
    .minus(txn.userInputs.outputs[0].amount)
    .minus(fee)
    .isPositive();

  return {
    ...txn,
    validation: {
      outputs: outputsAddresses,
      hasEnoughBalance,
    },
    computedData: {
      gasLimit,
      gasPrice,
      fee: fee.toString(10),
      output: {
        address: txn.userInputs.outputs[0].address,
        amount: txn.userInputs.outputs[0].amount,
      },
    },
  };
};
