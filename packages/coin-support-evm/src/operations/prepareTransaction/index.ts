import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { evmCoinList, ICoinInfo } from '@cypherock/coins';
import { assert, BigNumber } from '@cypherock/cysync-utils';

import { IPrepareEvmTransactionParams } from './types';

import { estimateGas } from '../../services';
import { IPreparedEvmTransaction } from '../transaction';
import { validateAddress } from '../validateAddress';

const validateAddresses = (
  params: IPrepareEvmTransactionParams,
  coin: ICoinInfo,
) => {
  const outputAddressValidation: boolean[] = [];

  for (const output of params.txn.userInputs.outputs) {
    let isValid = true;

    /**
     * We allow empty string in the validation (error prompt should not
     * appear for empty string). And validate only non-empty strings.
     */
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

  const outputsAddresses = validateAddresses(params, coin);
  const gasEstimate = await estimateGas(coin.id, {
    from: account.xpubOrAddress,
    to:
      txn.userInputs.outputs[0].address && outputsAddresses[0]
        ? txn.userInputs.outputs[0].address
        : account.xpubOrAddress,
    value: '0',
    data: '0x',
  });
  const gasLimit = txn.userInputs.gasLimit ?? gasEstimate.limit;
  const output = { ...txn.userInputs.outputs[0] };
  const gasPrice = txn.userInputs.gasPrice ?? txn.staticData.averageGasPrice;
  const l1Fee = gasEstimate.l1Cost;
  const fee = new BigNumber(gasLimit).multipliedBy(gasPrice).plus(l1Fee);
  const sendAllAmount = new BigNumber(account.balance).minus(fee);
  let hasEnoughBalance = sendAllAmount.minus(output.amount || '0').isPositive();

  if (txn.userInputs.isSendAll && sendAllAmount.isPositive()) {
    hasEnoughBalance = sendAllAmount.isPositive();
    output.amount = sendAllAmount.toString(10);
    // update userInput so that the max amount is editable & not reset to 0
    txn.userInputs.outputs[0].amount = output.amount;
  }
  txn.userInputs.gasLimit = gasLimit;
  return {
    ...txn,
    validation: {
      outputs: outputsAddresses,
      hasEnoughBalance,
    },
    computedData: {
      gasLimit,
      gasLimitEstimate: gasEstimate.limit,
      l1Fee,
      gasPrice,
      fee: fee.toString(10),
      output,
    },
  };
};
