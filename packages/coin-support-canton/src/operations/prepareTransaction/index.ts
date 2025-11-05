import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { cantonCoinList, ICoinInfo } from '@cypherock/coins';
import { assert, BigNumber } from '@cypherock/cysync-utils';

import { IPrepareCantonTransactionParams } from './types';

import { getIsAccountCreated, prepareSendTransaction } from '../../services';
import {
  IPreparedCantonTransaction,
  IPreparedCantonTransactionOutput,
} from '../transaction';
import { validateAddress } from '../validateAddress';

const validateAddresses = async (
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
      !validateAddress({ address: output.address, coinId: coin.id }) &&
      !(await getIsAccountCreated(output.address, params.keyDB))
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
  const { accountId, db, txn, keyDB } = params;
  const { account, coin } = await getAccountAndCoin(
    db,
    cantonCoinList,
    accountId,
  );

  assert(
    txn.userInputs.outputs.length === 1,
    new Error('Canton transaction requires exactly 1 output'),
  );

  const outputsValidation = await validateAddresses(params, coin);

  const output: IPreparedCantonTransactionOutput = {
    ...txn.userInputs.outputs[0],
  };

  output.amount = new BigNumber(output.amount).toString();
  let sendAmount = new BigNumber(output.amount);

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

  const isValidFee = true; //  new BigNumber(fees).isGreaterThan(0);
  const isFeeBelowMin =
    isValidFee && new BigNumber(fees).isLessThan(txn.staticData.fees);

  let isInvalidExpiry = false;
  if (output.expiry?.key && output.expiry?.value) {
    const expiryValue = output.expiry.value;
    const expiryDate = new Date(Date.now() + expiryValue.calculatedValueInMs);
    isInvalidExpiry = expiryDate.getTime() < Date.now();

    if (!isInvalidExpiry) {
      output.expiryDate = expiryDate.toISOString();
    }
  }

  const isValidAmount = !sendAmount.isNaN() && !sendAmount.isZero();

  const isValidInputs =
    output.address?.length &&
    isValidAmount &&
    outputsValidation.every(isValid => isValid) &&
    hasEnoughBalance &&
    isValidFee &&
    !isInvalidExpiry &&
    !isFeeBelowMin;

  let preparedTransaction: any;
  // prepare send transaction if all validations are passed
  if (isValidInputs) {
    preparedTransaction = await prepareSendTransaction(
      {
        partyId: account.xpubOrAddress,
        receiverPartyId: output.address,
        amount: output.amount,
        memo: output.memo,
        expiryDate: output.expiryDate,
      },
      keyDB,
    );
  }

  return {
    ...txn,
    validation: {
      outputs: outputsValidation,
      hasEnoughBalance,
      isValidFee,
      isFeeBelowMin,
      ownOutputAddressNotAllowed: [],
      zeroAmountNotAllowed: sendAmount.isZero(),
      isInvalidExpiry,
    },
    computedData: {
      fees,
      output,
      preparedTransaction,
    },
  };
};
