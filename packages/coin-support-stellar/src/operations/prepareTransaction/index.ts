import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { stellarCoinList, ICoinInfo } from '@cypherock/coins';
import { assert, BigNumber } from '@cypherock/cysync-utils';

import { IPrepareStellarTransactionParams } from './types';

import { getIsAccountActivated } from '../../services';
import { deriveAddress } from '../../utils';
import { IPreparedStellarTransaction, StellarMemoType } from '../transaction';
import { validateAddress } from '../validateAddress';

// Constants for Stellar-specific validations
const MAX_TEXT_MEMO_BYTES = 28;
const MAX_MEMO_ID_VALUE = BigInt('18446744073709551615'); // 2^64 - 1
const HASH_MEMO_HEX_LENGTH = 64; // 32 bytes as hex

const getByteLength = (str: string): number => Buffer.byteLength(str, 'utf8');

const isValidHex = (str: string, expectedLength: number): boolean =>
  /^[0-9a-fA-F]+$/.test(str) && str.length === expectedLength;

const validateAddresses = (
  params: IPrepareStellarTransactionParams,
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

const validateMemo = (memo?: {
  type: StellarMemoType;
  value?: string;
}): boolean => {
  if (!memo || memo.type === StellarMemoType.NONE) {
    return true;
  }

  if (!memo.value) {
    return false;
  }

  switch (memo.type) {
    case StellarMemoType.TEXT:
      return getByteLength(memo.value) <= MAX_TEXT_MEMO_BYTES;

    case StellarMemoType.ID:
      try {
        const idValue = BigInt(memo.value);
        return idValue >= BigInt(0) && idValue <= MAX_MEMO_ID_VALUE;
      } catch {
        return false;
      }

    case StellarMemoType.HASH:
    case StellarMemoType.RETURN:
      return isValidHex(memo.value, HASH_MEMO_HEX_LENGTH);

    default:
      return false;
  }
};

export const prepareTransaction = async (
  params: IPrepareStellarTransactionParams,
): Promise<IPreparedStellarTransaction> => {
  const { accountId, db, txn } = params;
  const { account, coin } = await getAccountAndCoin(
    db,
    stellarCoinList,
    accountId,
  );

  assert(
    txn.userInputs.outputs.length === 1,
    new Error('Stellar transaction requires exactly 1 output'),
  );

  const outputsValidation = validateAddresses(params, coin);
  let isActivated: boolean | undefined;
  let isCreateAccount = false;

  if (txn.userInputs.outputs[0].address === txn.computedData.output.address) {
    isActivated = txn.computedData.output.isActivated;
  }

  const output = { ...txn.userInputs.outputs[0], isActivated };

  if (output.address && outputsValidation[0]) {
    output.isActivated = await getIsAccountActivated(
      output.address,
      account.assetId,
    );

    txn.computedData.output.isActivated = output.isActivated;

    if (!output.isActivated) {
      isCreateAccount = true;
    }
  }

  output.amount = new BigNumber(output.amount).toFixed(0);
  let sendAmount = new BigNumber(output.amount);

  const myAddress = deriveAddress(account.xpubOrAddress);
  const isOwnOutputAddress = output.address === myAddress;

  const { fees } = txn.userInputs;

  const calculateMaxSend = () => {
    sendAmount = new BigNumber(
      BigNumber.max(
        new BigNumber(account.spendableBalance ?? account.balance).minus(fees),
        0,
      ).toFixed(0),
    );
    output.amount = sendAmount.toString(10);
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

  let isBalanceBelowStellarReserve = false;
  if (hasEnoughBalance) {
    const remainingBalance = new BigNumber(account.balance)
      .minus(sendAmount)
      .minus(fees);

    isBalanceBelowStellarReserve = remainingBalance.isLessThan(
      txn.staticData.reserveBaseBalance,
    );
  }

  let isAmountBelowStellarReserve = isCreateAccount;
  if (isAmountBelowStellarReserve) {
    isAmountBelowStellarReserve = sendAmount.isLessThan(
      txn.staticData.reserveBaseBalance,
    );
  }

  const isValidFee = new BigNumber(fees).isGreaterThan(0);
  const isFeeBelowMin =
    isValidFee && new BigNumber(fees).isLessThan(txn.staticData.fees);

  const isInvalidMemo = !validateMemo(output.memo);

  output.isCreateAccount = isCreateAccount;
  txn.computedData.output.isCreateAccount = isCreateAccount;

  return {
    ...txn,
    validation: {
      outputs: outputsValidation,
      hasEnoughBalance,
      isValidFee,
      isFeeBelowMin,
      ownOutputAddressNotAllowed: [isOwnOutputAddress],
      zeroAmountNotAllowed: sendAmount.isZero(),
      isAmountBelowStellarReserve,
      isBalanceBelowStellarReserve,
      isInvalidMemo,
    },
    computedData: {
      fees,
      output,
    },
  };
};
