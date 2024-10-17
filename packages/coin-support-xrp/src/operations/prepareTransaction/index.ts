import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { xrpCoinList, ICoinInfo } from '@cypherock/coins';
import { assert, BigNumber } from '@cypherock/cysync-utils';

import { IPrepareXrpTransactionParams } from './types';

import { getIsAccountActivated } from '../../services';
import { deriveAddress } from '../../utils';
import { IPreparedXrpTransaction } from '../transaction';
import { validateAddress } from '../validateAddress';

const validateAddresses = (
  params: IPrepareXrpTransactionParams,
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
  params: IPrepareXrpTransactionParams,
): Promise<IPreparedXrpTransaction> => {
  const { accountId, db, txn } = params;
  const { account, coin } = await getAccountAndCoin(db, xrpCoinList, accountId);

  assert(
    txn.userInputs.outputs.length === 1,
    new Error('Xrp transaction requires exactly 1 output'),
  );

  const outputsValidation = validateAddresses(params, coin);
  let isActivated: boolean | undefined;
  if (txn.userInputs.outputs[0].address === txn.computedData.output.address) {
    isActivated = txn.computedData.output.isActivated;
  }

  const output = { ...txn.userInputs.outputs[0], isActivated };

  if (
    output.address &&
    outputsValidation[0] &&
    output.isActivated === undefined
  ) {
    output.isActivated = await getIsAccountActivated(
      output.address,
      account.assetId,
    );
    txn.computedData.output.isActivated = output.isActivated;
  }

  // Amount shouldn't have any decimal value as it's in lowest unit
  output.amount = new BigNumber(output.amount).toFixed(0);
  let sendAmount = new BigNumber(output.amount);

  const myAddress = deriveAddress(account.xpubOrAddress);
  const isOwnOutputAddress = output.address === myAddress;

  const { fees } = txn.userInputs;

  const calculateMaxSend = () => {
    sendAmount = new BigNumber(
      BigNumber.max(
        new BigNumber(account.balance).minus(fees).minus(coin.reserveXrp),
        0,
      ).toFixed(0),
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

  let isBalanceBelowXrpReserve = false;
  if (hasEnoughBalance) {
    isBalanceBelowXrpReserve = !(
      sendAmount.isNaN() ||
      new BigNumber(account.balance).isGreaterThanOrEqualTo(
        sendAmount.plus(fees).plus(coin.reserveXrp),
      )
    );
  }

  let isAmountBelowXrpReserveAllowed = output.isActivated ?? true;
  if (!isAmountBelowXrpReserveAllowed) {
    isAmountBelowXrpReserveAllowed = sendAmount.isGreaterThanOrEqualTo(
      coin.reserveXrp,
    );
  }

  const isValidFee = new BigNumber(fees).isGreaterThan(0);
  const isFeeBelowMin =
    isValidFee && new BigNumber(fees).isLessThan(txn.staticData.fees);

  return {
    ...txn,
    validation: {
      outputs: outputsValidation,
      hasEnoughBalance,
      isValidFee,
      isFeeBelowMin,
      ownOutputAddressNotAllowed: [isOwnOutputAddress],
      zeroAmountNotAllowed: sendAmount.isZero(),
      isAmountBelowXrpReserveAllowed,
      isBalanceBelowXrpReserve,
    },
    computedData: {
      fees,
      output,
    },
  };
};
