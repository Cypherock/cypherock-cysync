import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { cantonCoinList, ICoinInfo } from '@cypherock/coins';
import { assert, BigNumber } from '@cypherock/cysync-utils';

import { IPrepareCantonTransactionParams } from './types';

import { IPreparedCantonTransaction } from '../transaction';
import { validateAddress } from '../validateAddress';

const validateAddresses = (
  params: IPrepareCantonTransactionParams,
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
  params: IPrepareCantonTransactionParams,
): Promise<IPreparedCantonTransaction> => {
  const { accountId, db, txn } = params;
  const { account, coin } = await getAccountAndCoin(
    db,
    cantonCoinList,
    accountId,
  );

  assert(
    txn.userInputs.outputs.length === 1,
    new Error('Canton transaction requires exactly 1 output'),
  );

  const outputsValidation = validateAddresses(params, coin);

  const output = { ...txn.userInputs.outputs[0] };

  output.amount = new BigNumber(output.amount).toString();
  let sendAmount = new BigNumber(output.amount);

  const myAddress = account.xpubOrAddress;
  const isOwnOutputAddress = output.address === myAddress;

  // TODO: Estimate fees
  const { fees } = txn.computedData;

  const calculateMaxSend = () => {
    sendAmount = new BigNumber(
      BigNumber.max(new BigNumber(account.balance).minus(fees), 0).toFixed(0),
    );
    output.amount = sendAmount.toString(10);
    // update userInput so that the max amount is editable & not reset to 0
    txn.userInputs.outputs[0].amount = output.amount;
  };

  let hasEnoughBalance: boolean;

  if (txn.userInputs.isSendAll) {
    calculateMaxSend();
  }

  hasEnoughBalance =
    sendAmount.isNaN() ||
    new BigNumber(account.balance).isGreaterThanOrEqualTo(
      sendAmount.plus(fees),
    );

  hasEnoughBalance =
    new BigNumber(txn.userInputs.outputs[0].amount).isNaN() || hasEnoughBalance;

  // TODO: validate fees
  const isValidFee = true; //  new BigNumber(fees).isGreaterThan(0);
  const isFeeBelowMin =
    isValidFee && new BigNumber(fees).isLessThan(txn.staticData.fees);

  // TODO: validate expiry
  const isInvalidExpiry = false;

  return {
    ...txn,
    validation: {
      outputs: outputsValidation,
      hasEnoughBalance,
      isValidFee,
      isFeeBelowMin,
      ownOutputAddressNotAllowed: [isOwnOutputAddress],
      zeroAmountNotAllowed: sendAmount.isZero(),
      isInvalidExpiry,
    },
    computedData: {
      fees,
      output,
    },
  };
};
