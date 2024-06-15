import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { tronCoinList, ICoinInfo } from '@cypherock/coins';
import { assert, BigNumber } from '@cypherock/cysync-utils';

import { IPrepareTronTransactionParams } from './types';

import { IPreparedTronTransaction } from '../transaction';
import { validateAddress } from '../validateAddress';

const validateAddresses = (
  params: IPrepareTronTransactionParams,
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
  params: IPrepareTronTransactionParams,
): Promise<IPreparedTronTransaction> => {
  const { accountId, db, txn } = params;
  const { account, coin } = await getAccountAndCoin(
    db,
    tronCoinList,
    accountId,
  );

  assert(
    txn.userInputs.outputs.length === 1,
    new Error('Tron transaction requires exactly 1 output'),
  );

  const outputsAddresses = validateAddresses(params, coin);
  const output = { ...txn.userInputs.outputs[0] };
  // Amount shouldn't have any decimal value as it's in lowest unit
  output.amount = new BigNumber(output.amount).toFixed(0);

  let hasEnoughBalance: boolean;

  const sendAmount = new BigNumber(output.amount);
  if (txn.userInputs.isSendAll) {
    // sendAmount = new BigNumber(
    //   BigNumber.max(new BigNumber(account.balance).minus(fee), 0).toFixed(0),
    // );
    // output.amount = sendAmount.toString(10);
    // // update userInput so that the max amount is editable & not reset to 0
    // txn.userInputs.outputs[0].amount = output.amount;
  }
  hasEnoughBalance =
    sendAmount.isNaN() ||
    new BigNumber(account.balance).isGreaterThanOrEqualTo(sendAmount);

  hasEnoughBalance =
    new BigNumber(txn.userInputs.outputs[0].amount).isNaN() || hasEnoughBalance;

  return {
    ...txn,
    validation: {
      outputs: outputsAddresses,
      hasEnoughBalance,
      isValidFee: true,
    },
    computedData: {
      fee: '0',
      output,
    },
  };
};
