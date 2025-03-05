import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { icpCoinList, ICoinInfo } from '@cypherock/coins';
import { assert, BigNumber } from '@cypherock/cysync-utils';

import { IPrepareIcpTransactionParams } from './types';

import { getIngressExpiry, getNonce } from '../../utils';
import { IPreparedIcpTransaction } from '../transaction';
import { validateAddress } from '../validateAddress';

const MAX_UINT64 = new BigNumber('0xffffffffffffffff');

const validateAddresses = (
  params: IPrepareIcpTransactionParams,
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
  params: IPrepareIcpTransactionParams,
): Promise<IPreparedIcpTransaction> => {
  const { accountId, db, txn } = params;
  const { account, coin } = await getAccountAndCoin(db, icpCoinList, accountId);

  assert(
    txn.userInputs.outputs.length === 1,
    new Error('Icp transaction requires exactly 1 output'),
  );

  const outputsValidation = validateAddresses(params, coin);

  const output = { ...txn.userInputs.outputs[0] };

  // Amount shouldn't have any decimal value as it's in lowest unit
  output.amount = new BigNumber(output.amount).toFixed(0);
  let sendAmount = new BigNumber(output.amount);

  const myAddress = account.xpubOrAddress;
  const isOwnOutputAddress = output.address === myAddress;

  const { fees } = txn.staticData;

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

  const isInvalidMemo =
    output.memo !== undefined
      ? new BigNumber(output.memo).isGreaterThanOrEqualTo(MAX_UINT64)
      : false;

  return {
    ...txn,
    validation: {
      outputs: outputsValidation,
      hasEnoughBalance,
      isValidFee: true,
      ownOutputAddressNotAllowed: [isOwnOutputAddress],
      zeroAmountNotAllowed: sendAmount.isZero(),
      isInvalidMemo,
    },
    computedData: {
      fees,
      output,
      ingressExpiry: getIngressExpiry(),
      nonce: getNonce(),
    },
  };
};
