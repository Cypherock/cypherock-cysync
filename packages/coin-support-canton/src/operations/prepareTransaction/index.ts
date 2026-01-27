import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { cantonCoinList, ICoinInfo } from '@cypherock/coins';
import { assert, BigNumber } from '@cypherock/cysync-utils';
import { AccountTypeMap } from '@cypherock/db-interfaces';

import { IPrepareCantonTransactionParams } from './types';

import {
  doesPartyExist,
  prepareSendTransaction,
  ICantonInstrument,
} from '../../services';
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
      (!validateAddress({ address: output.address, coinId: coin.id }) ||
        !(await doesPartyExist(output.address, params.keyDB)))
    ) {
      isValid = false;
    }

    outputAddressValidation.push(isValid);
  }

  return outputAddressValidation;
};

const selectUtxos = (targetAmount: string, sortedUtxos: any[]): string[] => {
  // Select utxos whose total sum is greater than or equal to the targetAmount
  // We need to select the minimum number of utxos that can be used to send the targetAmount
  // So that the traffic cost is minimized
  // and transaction is faster

  // considering the utxos in descending order of value
  // Single UTXO >= targetAmount
  for (let i = sortedUtxos.length - 1; i >= 0; i -= 1) {
    const currentUtxo = sortedUtxos[i];
    if (
      new BigNumber(
        currentUtxo.interfaceViewValue.amount,
      ).isGreaterThanOrEqualTo(targetAmount)
    ) {
      return [currentUtxo.contractId];
    }
  }

  let totalAmount = new BigNumber(0);
  const selectedUtxos: string[] = [];
  for (const utxo of sortedUtxos) {
    totalAmount = totalAmount.plus(utxo.interfaceViewValue.amount);
    selectedUtxos.push(utxo.contractId);

    if (totalAmount.isGreaterThanOrEqualTo(targetAmount)) {
      break;
    }
  }

  return selectedUtxos;
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

  let instrument: ICantonInstrument;
  let decimals = 10;
  const isTokenAccount = account.type === AccountTypeMap.subAccount;
  if (isTokenAccount) {
    const tokenDetails =
      cantonCoinList[account.parentAssetId].tokens[account.assetId];
    instrument = tokenDetails.instrument;
    decimals = tokenDetails.decimals;
  } else {
    instrument = cantonCoinList[account.assetId].instrument;
    decimals = cantonCoinList[account.assetId].decimals;
  }

  assert(
    txn.userInputs.outputs.length === 1,
    new Error('Canton transaction requires exactly 1 output'),
  );

  const outputsValidation =
    txn.userInputs.outputs?.[0]?.address !== txn.computedData.output.address
      ? await validateAddresses(params, coin)
      : [...txn.validation.outputs];

  const output: IPreparedCantonTransactionOutput = {
    ...txn.userInputs.outputs[0],
  };

  output.amount = new BigNumber(output.amount).toFixed(decimals);
  // update userInput so that the amount is displayed in the correct format upto correct decimal places
  txn.userInputs.outputs[0].amount = output.amount;
  let sendAmount = new BigNumber(output.amount);

  const { fees } = txn.computedData;

  const calculateMaxSend = () => {
    sendAmount = new BigNumber(
      BigNumber.max(new BigNumber(account.balance).minus(fees), 0).toFixed(
        decimals,
      ),
    );
    output.amount = sendAmount.toString(10);
    // update userInput so that the max amount is editable & not reset to 0
    txn.userInputs.outputs[0].amount = output.amount;
  };

  if (txn.userInputs.isSendAll) {
    calculateMaxSend();
  }

  const isValidAmount = !sendAmount.isNaN() && !sendAmount.isZero();

  let hasEnoughBalance: boolean;
  hasEnoughBalance =
    sendAmount.isNaN() ||
    new BigNumber(account.balance).isGreaterThanOrEqualTo(
      sendAmount.plus(fees),
    );

  hasEnoughBalance =
    new BigNumber(txn.userInputs.outputs[0].amount).isNaN() || hasEnoughBalance;

  let isInvalidExpiry = false;
  if (output.expiry?.key && output.expiry?.value) {
    const expiryValue = output.expiry.value;
    const expiryDate = new Date(Date.now() + expiryValue.calculatedValueInMs);
    isInvalidExpiry = expiryDate.getTime() < Date.now();

    if (!isInvalidExpiry) {
      output.expiryDate = expiryDate.toISOString();
    }
  }

  const isValidInputs =
    output.address?.length &&
    isValidAmount &&
    outputsValidation.every(isValid => isValid) &&
    hasEnoughBalance &&
    !isInvalidExpiry;

  let preparedTransaction: any;
  // prepare send transaction if all validations are passed
  if (isValidInputs) {
    preparedTransaction = await prepareSendTransaction(
      {
        partyId: account.xpubOrAddress,
        receiverPartyId: output.address,
        amount: output.amount,
        instrument,
        memo: output.memo,
        expiryDate: output.expiryDate,
        inputUtxos: selectUtxos(output.amount, txn.staticData.sortedUtxos),
      },
      keyDB,
    );
  }

  return {
    ...txn,
    validation: {
      outputs: outputsValidation,
      hasEnoughBalance,
      isValidFee: true,
      isFeeBelowMin: false,
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
