import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { tronCoinList, ICoinInfo } from '@cypherock/coins';
import { assert, BigNumber } from '@cypherock/cysync-utils';
import { IUnsignedTransaction } from '@cypherock/sdk-app-tron';

import { IPrepareTronTransactionParams } from './types';

import { estimateBandwidth, prepareUnsignedSendTxn } from '../../utils';
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

const calculateBandwidthAndFees = (
  unsignedTransaction: IUnsignedTransaction | undefined,
  txn: IPreparedTronTransaction,
) => {
  const bandwidth = unsignedTransaction
    ? estimateBandwidth(unsignedTransaction)
    : 268;

  let paidBandwidth = bandwidth;
  if (
    txn.staticData.totalFreeBandwidthAvailable > bandwidth ||
    txn.staticData.totalFreeBandwidthAvailable > bandwidth
  ) {
    paidBandwidth = 0;
  }

  let fees = '0';
  if (paidBandwidth > 0) {
    let dustFees = 0;
    if (txn.userInputs.isSendAll) {
      dustFees = 5 * 1000;
    }

    fees = new BigNumber(paidBandwidth)
      .multipliedBy(1000)
      .plus(dustFees)
      .toFixed(0);
  }

  return {
    fees,
    bandwidth,
  };
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
  let sendAmount = new BigNumber(output.amount);

  let unsignedTransaction: IUnsignedTransaction | undefined;

  const isOwnOutputAddress =
    (output.address ?? '').toLowerCase() ===
    account.xpubOrAddress.toLowerCase();
  const createUnsignedTransaction = async () => {
    if (output.address && outputsAddresses[0] && !isOwnOutputAddress) {
      unsignedTransaction = await prepareUnsignedSendTxn({
        from: account.xpubOrAddress,
        to: output.address,
        amount: sendAmount.isGreaterThan(0) ? sendAmount.toString() : '1',
      });
    }
  };

  const calculateMaxSend = () => {
    sendAmount = new BigNumber(
      BigNumber.max(new BigNumber(account.balance).minus(fees), 0).toFixed(0),
    );
    output.amount = sendAmount.toString(10);
    // update userInput so that the max amount is editable & not reset to 0
    txn.userInputs.outputs[0].amount = output.amount;
  };

  await createUnsignedTransaction();
  const { fees, bandwidth } = calculateBandwidthAndFees(
    unsignedTransaction,
    txn,
  );
  let hasEnoughBalance: boolean;

  if (txn.userInputs.isSendAll) {
    calculateMaxSend();
    await createUnsignedTransaction();
  }

  hasEnoughBalance =
    sendAmount.isNaN() ||
    new BigNumber(account.balance).isGreaterThanOrEqualTo(
      sendAmount.plus(fees),
    );
  hasEnoughBalance =
    new BigNumber(txn.userInputs.outputs[0].amount).isNaN() || hasEnoughBalance;

  return {
    ...txn,
    validation: {
      outputs: outputsAddresses,
      hasEnoughBalance,
      isValidFee: true,
      ownOutputAddressNotAllowed: [isOwnOutputAddress],
      zeroAmountNotAllowed: sendAmount.isZero(),
    },
    computedData: {
      fee: fees.toString(),
      output,
      unsignedTransaction,
      bandwidth,
    },
  };
};
