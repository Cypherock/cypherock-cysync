import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { tronCoinList, ICoinInfo, ITronTrc20Token } from '@cypherock/coins';
import { assert, BigNumber } from '@cypherock/cysync-utils';
import { IAccount } from '@cypherock/db-interfaces';
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

const calculateBandwidthAndFees = async (params: {
  unsignedTransaction: IUnsignedTransaction | undefined;
  txn: IPreparedTronTransaction;
  tokenDetails?: ITronTrc20Token;
  account: IAccount;
}) => {
  const { unsignedTransaction, txn, tokenDetails } = params;

  const bandwidth = unsignedTransaction
    ? estimateBandwidth(unsignedTransaction)
    : 268;

  let paidBandwidth = bandwidth;
  let dustFee = 0;
  const { estimatedEnergy } = txn.computedData;

  if (txn.staticData.totalBandwidthAvailable > bandwidth) {
    paidBandwidth = 0;
  }

  if (paidBandwidth > 0 && txn.userInputs.isSendAll && !tokenDetails) {
    dustFee = 5 * 1000;
  }

  const paidEnergy = Math.max(
    0,
    estimatedEnergy - txn.staticData.totalEnergyAvailable,
  );

  const fees = new BigNumber(paidBandwidth)
    .multipliedBy(1000)
    .plus(dustFee)
    .plus(
      new BigNumber(paidEnergy).multipliedBy(txn.staticData.averageEnergyPrice),
    )
    .toFixed(0);

  return {
    fees,
    bandwidth,
  };
};

export const prepareTransaction = async (
  params: IPrepareTronTransactionParams,
): Promise<IPreparedTronTransaction> => {
  const { accountId, db, txn } = params;
  const { account, coin, parentAccount } = await getAccountAndCoin(
    db,
    tronCoinList,
    accountId,
  );

  assert(
    txn.userInputs.outputs.length === 1,
    new Error('Tron transaction requires exactly 1 output'),
  );

  let tokenDetails: ITronTrc20Token | undefined;
  if (parentAccount !== undefined)
    tokenDetails = tronCoinList[account.parentAssetId].tokens[account.assetId];

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
      const result = await prepareUnsignedSendTxn({
        from: account.xpubOrAddress,
        to: output.address,
        amount: sendAmount.isGreaterThan(0) ? sendAmount.toString() : '1',
        tokenDetails,
        averageEnergyPrice: txn.staticData.averageEnergyPrice,
      });

      unsignedTransaction = result.txn;
      txn.computedData.estimatedEnergy = result.estimatedEnergy ?? 0;
    }
  };

  const calculateMaxSend = () => {
    if (tokenDetails) {
      sendAmount = new BigNumber(account.balance);
    } else {
      sendAmount = new BigNumber(
        BigNumber.max(new BigNumber(account.balance).minus(fees), 0).toFixed(0),
      );
    }
    output.amount = sendAmount.toString(10);
    // update userInput so that the max amount is editable & not reset to 0
    txn.userInputs.outputs[0].amount = output.amount;
  };

  await createUnsignedTransaction();
  const { fees, bandwidth } = await calculateBandwidthAndFees({
    unsignedTransaction,
    txn,
    tokenDetails,
    account,
  });
  let hasEnoughBalance: boolean;
  let notEnoughEnergy = false;

  if (tokenDetails && txn.staticData.totalEnergyAvailable < 65000) {
    notEnoughEnergy = true;
  }

  if (txn.userInputs.isSendAll) {
    calculateMaxSend();
    await createUnsignedTransaction();
  }

  if (tokenDetails) {
    hasEnoughBalance =
      sendAmount.isNaN() ||
      new BigNumber(account.balance).isGreaterThanOrEqualTo(sendAmount);
  } else {
    hasEnoughBalance =
      sendAmount.isNaN() ||
      new BigNumber(account.balance).isGreaterThanOrEqualTo(
        sendAmount.plus(fees),
      );
  }

  hasEnoughBalance =
    new BigNumber(txn.userInputs.outputs[0].amount).isNaN() || hasEnoughBalance;

  return {
    ...txn,
    validation: {
      outputs: outputsAddresses,
      hasEnoughBalance,
      notEnoughEnergy,
      isValidFee: true,
      ownOutputAddressNotAllowed: [isOwnOutputAddress],
      zeroAmountNotAllowed: sendAmount.isZero(),
    },
    computedData: {
      fee: fees.toString(),
      output,
      unsignedTransaction,
      bandwidth,
      estimatedEnergy: txn.computedData.estimatedEnergy,
    },
  };
};
