import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { siaCoinList } from '@cypherock/coins';
import { assert } from '@cypherock/cysync-utils';
import { ISiaUtxo, getUtxos } from '../../services';

import { IPrepareSiaTransactionParams } from './types';

import { IPreparedSiaTransaction } from '../transaction';
import { validateAddress } from '../validateAddress';

const normalizeAmount = (amount: string): string => {
  if (amount.includes('e') || amount.includes('E')) {
    return parseFloat(amount).toFixed(0);
  }
  return amount;
};

const validateAddresses = (
  params: IPrepareSiaTransactionParams,
  coinId: string,
) => {
  const outputAddressValidation: boolean[] = [];

  for (const output of params.txn.userInputs.outputs) {
    let isValid = true;

    if (
      output.address &&
      !validateAddress({
        address: output.address,
        coinId,
      })
    ) {
      isValid = false;
    }

    outputAddressValidation.push(isValid);
  }

  return outputAddressValidation;
};

const selectCoins = (
  utxos: ISiaUtxo[],
  targetAmountHastings: bigint,
  feeHastings: bigint,
) => {
  const needed = targetAmountHastings + feeHastings;

  const sortedUTXOs = [...utxos].sort((a, b) => {
    const valueA = BigInt(a.value);
    const valueB = BigInt(b.value);
    return Number(valueB - valueA);
  });

  const selected: ISiaUtxo[] = [];
  let total = BigInt(0);

  for (const utxo of sortedUTXOs) {
    selected.push(utxo);
    total += BigInt(utxo.value);

    if (total >= needed) {
      break;
    }
  }

  if (total < needed) {
    throw new Error('Insufficient funds');
  }

  const change = total - needed;
  return { selected, total, change };
};

export const prepareTransaction = async (
  params: IPrepareSiaTransactionParams,
): Promise<IPreparedSiaTransaction> => {
  const { accountId, db, txn } = params;
  const { account, coin } = await getAccountAndCoin(db, siaCoinList, accountId);

  assert(
    txn.userInputs.outputs.length === 1,
    new Error('Sia transaction requires exactly 1 output'),
  );

  const outputsValidation = validateAddresses(params, coin.id);
  const output = { ...txn.userInputs.outputs[0] };

  if (!output.address || !outputsValidation[0]) {
    return {
      ...txn,
      validation: {
        outputs: outputsValidation,
        hasEnoughBalance: false,
        isValidFee: false,
        ownOutputAddressNotAllowed: [false],
        zeroAmountNotAllowed: false,
      },
      computedData: {
        fees: txn.userInputs.fees,
        output,
        selectedUtxos: [],
      },
    };
  }

  const utxosResponse = await getUtxos(account.xpubOrAddress);
  const availableUTXOs = utxosResponse.utxos;

  const normalizedAmount = normalizeAmount(output.amount);
  const normalizedFee = normalizeAmount(txn.userInputs.fees);

  let sendAmountHastings = BigInt(normalizedAmount);
  const feeHastings = BigInt(normalizedFee);

  const totalAvailableHastings = availableUTXOs.reduce(
    (sum, utxo) => sum + BigInt(utxo.value),
    BigInt(0),
  );

  // Handle Send All
  if (txn.userInputs.isSendAll) {
    const maxSendableHastings = totalAvailableHastings - feeHastings;
    if (maxSendableHastings <= BigInt(0)) {
      sendAmountHastings = BigInt(0);
    } else {
      sendAmountHastings = maxSendableHastings;
    }

    output.amount = sendAmountHastings.toString();
    txn.userInputs.outputs[0].amount = sendAmountHastings.toString();
  }

  console.log('Amount validation:', {
    inputAmount: output.amount,
    normalizedAmount,
    sendAmountHastings: sendAmountHastings.toString(),
    feeHastings: feeHastings.toString(),
    totalAvailable: totalAvailableHastings.toString(),
    utxoCount: availableUTXOs.length,
  });

  let selectedUtxos: ISiaUtxo[] = [];
  let hasEnoughBalance = true;

  if (sendAmountHastings > BigInt(0)) {
    try {
      const selection = selectCoins(
        availableUTXOs,
        sendAmountHastings,
        feeHastings,
      );
      selectedUtxos = selection.selected;
      hasEnoughBalance = true;
    } catch (error) {
      console.log('Coin selection failed:', String(error));
      hasEnoughBalance = false;
      selectedUtxos = [];
    }
  }

  const isValidFee = BigInt(normalizedFee) > BigInt(0);
  const baseFeeHastings = BigInt(txn.staticData.fees.baseFee);
  const isFeeBelowMin = isValidFee && BigInt(normalizedFee) < baseFeeHastings;

  const zeroAmountNotAllowed = sendAmountHastings === BigInt(0);
  const ownOutputAddressNotAllowed = output.address === account.xpubOrAddress;

  return {
    ...txn,
    validation: {
      outputs: outputsValidation,
      hasEnoughBalance,
      isValidFee: isValidFee && !isFeeBelowMin,
      ownOutputAddressNotAllowed: [ownOutputAddressNotAllowed],
      zeroAmountNotAllowed,
    },
    computedData: {
      fees: txn.userInputs.fees,
      output,
      selectedUtxos,
    },
  };
};
