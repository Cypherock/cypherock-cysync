import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { siaCoinList } from '@cypherock/coins';
import { assert } from '@cypherock/cysync-utils';
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

  console.log('DEBUG: Coin selection input:', {
    targetAmountHastings: targetAmountHastings.toString(),
    feeHastings: feeHastings.toString(),
    needed: needed.toString(),
    availableUtxos: utxos.length,
  });

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

    console.log('DEBUG: Selected UTXO:', {
      utxoId: `${utxo.id.substring(0, 8)}...`,
      utxoValue: utxo.value,
      totalSoFar: total.toString(),
      needed: needed.toString(),
    });

    if (total >= needed) {
      break;
    }
  }

  if (total < needed) {
    console.log('DEBUG: Insufficient funds for coin selection:', {
      totalAvailable: total.toString(),
      needed: needed.toString(),
      shortfall: (needed - total).toString(),
    });
    throw new Error('Insufficient funds');
  }

  const change = total - needed;

  console.log('DEBUG: Coin selection result:', {
    selectedCount: selected.length,
    totalInput: total.toString(),
    change: change.toString(),
  });

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
      console.log('DEBUG: Invalid address format:', output.address);
    }

    outputAddressValidation.push(isValid);
  }

  console.log('DEBUG: Address validation results:', outputAddressValidation);
  return outputAddressValidation;
};

export const prepareTransaction = async (
  params: IPrepareSiaTransactionParams,
): Promise<IPreparedSiaTransaction> => {
  console.log('DEBUG: prepareTransaction started');

  const { accountId, db, txn } = params;
  const { account, coin } = await getAccountAndCoin(db, siaCoinList, accountId);

  console.log('DEBUG: Account info:', {
    address: account.xpubOrAddress,
    accountId,
  });

  assert(
    txn.userInputs.outputs.length === 1,
    new Error('Sia transaction requires exactly 1 output'),
  );

  const outputsValidation = validateAddresses(params, coin.id);
  const output = { ...txn.userInputs.outputs[0] };

  console.log('DEBUG: User inputs:', {
    amount: output.amount,
    address: output.address,
    fee: txn.userInputs.fees,
    isSendAll: txn.userInputs.isSendAll,
  });

  if (!output.address || !outputsValidation[0]) {
    console.log('DEBUG: Early return - invalid address');
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
        changeAmount: '0',
      },
    };
  }

  let sendAmountSC = output.amount;
  const feeSC = txn.userInputs.fees;

  console.log('DEBUG: Amount conversion:', {
    inputAmountSC: sendAmountSC,
    inputFeeSC: feeSC,
  });

  let sendAmountHastings: bigint;
  const feeHastings = BigInt(scToHastings(feeSC));

  console.log('DEBUG: Fetching balance...');
  const balanceSC = await getBalance(account.xpubOrAddress);
  const balanceHastings = BigInt(scToHastings(balanceSC));

  console.log('DEBUG: Balance info:', {
    balanceSC,
    balanceHastings: balanceHastings.toString(),
    feeHastings: feeHastings.toString(),
  });

  // Handle Send All
  if (txn.userInputs.isSendAll) {
    console.log('DEBUG: Processing Send All transaction');

    const maxSendableHastings = balanceHastings - feeHastings;
    if (maxSendableHastings <= BigInt(0)) {
      console.log('DEBUG: Send All - insufficient balance for fee');
      sendAmountHastings = BigInt(0);
      sendAmountSC = '0';
    } else {
      sendAmountHastings = maxSendableHastings;
      sendAmountSC = hastingsToSC(sendAmountHastings.toString());
    }

    // Update output amounts
    output.amount = sendAmountSC;
    txn.userInputs.outputs[0].amount = sendAmountSC;

    console.log('DEBUG: Send All calculated amount:', {
      sendAmountHastings: sendAmountHastings.toString(),
      sendAmountSC,
    });
  } else {
    sendAmountHastings = BigInt(scToHastings(sendAmountSC));
  }

  const totalNeeded = sendAmountHastings + feeHastings;
  let hasEnoughBalance = balanceHastings >= totalNeeded;

  console.log('DEBUG: Balance validation:', {
    sendAmountHastings: sendAmountHastings.toString(),
    feeHastings: feeHastings.toString(),
    totalNeeded: totalNeeded.toString(),
    balanceHastings: balanceHastings.toString(),
    hasEnoughBalance,
  });

  const baseFeeHastings = BigInt(scToHastings(txn.staticData.fees.baseFee));
  const isValidFee = feeHastings > BigInt(0);
  const isFeeBelowMin = isValidFee && feeHastings < baseFeeHastings;

  console.log('DEBUG: Fee validation:', {
    baseFeeHastings: baseFeeHastings.toString(),
    feeHastings: feeHastings.toString(),
    isValidFee,
    isFeeBelowMin,
  });

  // Step 6: Other validations
  const zeroAmountNotAllowed = sendAmountHastings === BigInt(0);
  const ownOutputAddressNotAllowed = output.address === account.xpubOrAddress;

  console.log('DEBUG: Other validations:', {
    zeroAmountNotAllowed,
    ownOutputAddressNotAllowed,
  });

  let selectedUtxos: ISiaUtxo[] = [];
  let changeAmountHastings = '0';

  if (hasEnoughBalance && sendAmountHastings > BigInt(0)) {
    try {
      console.log('DEBUG: Fetching UTXOs for coin selection...');
      const utxosResponse = await getUtxos(account.xpubOrAddress);
      const availableUTXOs = utxosResponse.utxos;

      console.log('DEBUG: UTXO fetch result:', {
        utxoCount: availableUTXOs.length,
        totalUtxoValue: availableUTXOs
          .reduce((sum, utxo) => sum + BigInt(utxo.value), BigInt(0))
          .toString(),
      });

      const selection = selectCoins(
        availableUTXOs,
        sendAmountHastings,
        feeHastings,
      );

      selectedUtxos = selection.selected;
      changeAmountHastings = selection.change.toString();
      hasEnoughBalance = true;

      console.log('DEBUG: UTXO selection successful:', {
        selectedCount: selectedUtxos.length,
        totalSelected: selection.total.toString(),
        change: selection.change.toString(),
      });
    } catch (error) {
      console.log('DEBUG: UTXO selection failed:', String(error));
      hasEnoughBalance = false;
      selectedUtxos = [];
    }
  } else {
    console.log(
      'DEBUG: Skipping UTXO selection - insufficient balance or zero amount',
    );
  }

  const finalValidation = {
    outputs: outputsValidation,
    hasEnoughBalance,
    isValidFee: isValidFee && !isFeeBelowMin,
    ownOutputAddressNotAllowed: [ownOutputAddressNotAllowed],
    zeroAmountNotAllowed,
  };

  console.log('DEBUG: Final validation results:', finalValidation);

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

  console.log('DEBUG: prepareTransaction completed successfully');
  return result;
};
