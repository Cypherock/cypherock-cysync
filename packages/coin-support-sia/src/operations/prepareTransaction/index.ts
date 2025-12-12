import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { siaCoinList } from '@cypherock/coins';
import { assert, BigNumber } from '@cypherock/cysync-utils';
import { ISiaUtxo, getUtxos, getBalance } from '../../services';
import { scToHastings, hastingsToSC } from '../../utils';

import { IPrepareSiaTransactionParams } from './types';
import { IPreparedSiaTransaction } from '../transaction';
import { validateAddress } from '../validateAddress';

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

  const outputAmountBN = new BigNumber(output.amount || '0');
  const feeAmountBN = new BigNumber(txn.userInputs.fees || '0');

  let sendAmountSC = outputAmountBN.isNaN() ? '0' : outputAmountBN.toFixed();
  const feeSC = feeAmountBN.isNaN()
    ? txn.staticData.fees.recommendedFee
    : feeAmountBN.toFixed();

  output.amount = sendAmountSC;

  let sendAmountHastings: bigint;
  const feeHastings = BigInt(scToHastings(feeSC));

  const balanceSC = await getBalance(account.xpubOrAddress);
  const balanceHastings = BigInt(scToHastings(balanceSC));

  // Handle Send All
  if (txn.userInputs.isSendAll) {
    const maxSendableHastings = balanceHastings - feeHastings;
    if (maxSendableHastings <= BigInt(0)) {
      sendAmountHastings = BigInt(0);
      sendAmountSC = '0';
    } else {
      sendAmountHastings = maxSendableHastings;
      sendAmountSC = hastingsToSC(sendAmountHastings.toString());
    }

    output.amount = sendAmountSC;
    txn.userInputs.outputs[0].amount = sendAmountSC;
  }

  let hasEnoughBalance: boolean;
  const sendAmountBN = new BigNumber(sendAmountSC);

  if (sendAmountBN.isNaN()) {
    sendAmountHastings = BigInt(0);
    hasEnoughBalance = false;
  } else {
    sendAmountHastings = BigInt(scToHastings(sendAmountSC));
    const totalNeeded = sendAmountHastings + feeHastings;
    hasEnoughBalance = balanceHastings >= totalNeeded;
  }

  // Fee validation
  const baseFeeHastings = BigInt(scToHastings(txn.staticData.fees.baseFee));
  const isValidFee = feeHastings > BigInt(0);
  const isFeeBelowMin = isValidFee && feeHastings < baseFeeHastings;

  // Other validations
  const zeroAmountNotAllowed = sendAmountHastings === BigInt(0);
  const ownOutputAddressNotAllowed = output.address === account.xpubOrAddress;

  // Early return for invalid address
  if (!output.address || !outputsValidation[0]) {
    const finalValidation = {
      outputs: outputsValidation,
      hasEnoughBalance,
      isValidFee: isValidFee && !isFeeBelowMin,
      ownOutputAddressNotAllowed: [ownOutputAddressNotAllowed],
      zeroAmountNotAllowed,
    };

    return {
      ...txn,
      validation: finalValidation,
      computedData: {
        fees: txn.userInputs.fees,
        output,
        selectedUtxos: [],
        changeAmount: '0',
      },
    };
  }

  let selectedUtxos: ISiaUtxo[] = [];
  let changeAmountHastings = '0';

  if (hasEnoughBalance && sendAmountHastings > BigInt(0)) {
    try {
      const utxosResponse = await getUtxos(account.xpubOrAddress);
      const availableUTXOs = utxosResponse.utxos;

      const selection = selectCoins(
        availableUTXOs,
        sendAmountHastings,
        feeHastings,
      );

      selectedUtxos = selection.selected;
      changeAmountHastings = selection.change.toString();
      hasEnoughBalance = true;
    } catch (error) {
      hasEnoughBalance = false;
      selectedUtxos = [];
    }
  }

  const finalValidation = {
    outputs: outputsValidation,
    hasEnoughBalance,
    isValidFee: isValidFee && !isFeeBelowMin,
    ownOutputAddressNotAllowed: [ownOutputAddressNotAllowed],
    zeroAmountNotAllowed,
  };

  const result = {
    ...txn,
    validation: finalValidation,
    computedData: {
      fees: txn.userInputs.fees,
      output,
      selectedUtxos,
      changeAmount: changeAmountHastings,
    },
  };

  return result;
};
