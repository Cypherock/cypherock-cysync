import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { siaCoinList } from '@cypherock/coins';
import { assert, BigNumber } from '@cypherock/cysync-utils';

import { IPrepareSiaTransactionParams } from './types';

import { ISiaUtxo, getUtxos, getBalance } from '../../services';
import { scToHastings, hastingsToSC } from '../../utils';
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

const processAmountsAndFees = (
  txn: IPrepareSiaTransactionParams['txn'],
  output: any,
) => {
  const outputAmountBN = new BigNumber(output.amount || '0');
  const feeAmountBN = new BigNumber(txn.userInputs.fees || '0');

  const sendAmountSC = outputAmountBN.isNaN() ? '0' : outputAmountBN.toFixed();
  const feeSC = feeAmountBN.isNaN()
    ? txn.staticData.fees.recommendedFee
    : feeAmountBN.toFixed();

  const sendAmountHastings = BigInt(scToHastings(sendAmountSC));
  const feeHastings = BigInt(scToHastings(feeSC));

  return {
    sendAmountSC,
    sendAmountHastings,
    feeSC,
    feeHastings,
    output: { ...output, amount: sendAmountSC },
  };
};

const handleSendAll = (
  txn: IPrepareSiaTransactionParams['txn'],
  output: any,
  balanceHastings: bigint,
  feeHastings: bigint,
) => {
  let sendAmountHastings: bigint;
  let sendAmountSC: string;

  const maxSendableHastings = balanceHastings - feeHastings;
  if (maxSendableHastings <= BigInt(0)) {
    sendAmountHastings = BigInt(0);
    sendAmountSC = '0';
  } else {
    sendAmountHastings = maxSendableHastings;
    sendAmountSC = hastingsToSC(sendAmountHastings.toString());
  }

  return {
    sendAmountHastings,
    sendAmountSC,
    output: { ...output, amount: sendAmountSC },
    txn: {
      ...txn,
      userInputs: {
        ...txn.userInputs,
        outputs: [{ ...txn.userInputs.outputs[0], amount: sendAmountSC }],
      },
    },
  };
};

const validateBalanceAndFees = (
  sendAmountSC: string,
  sendAmountHastings: bigint,
  feeHastings: bigint,
  balanceHastings: bigint,
  txn: IPrepareSiaTransactionParams['txn'],
) => {
  const sendAmountBN = new BigNumber(sendAmountSC);

  let hasEnoughBalance: boolean;
  let finalSendAmountHastings: bigint;

  if (sendAmountBN.isNaN()) {
    finalSendAmountHastings = BigInt(0);
    hasEnoughBalance = false;
  } else {
    finalSendAmountHastings = sendAmountHastings;
    const totalNeeded = sendAmountHastings + feeHastings;
    hasEnoughBalance = balanceHastings >= totalNeeded;
  }

  // Fee validation
  const baseFeeHastings = BigInt(scToHastings(txn.staticData.fees.baseFee));
  const isValidFee = feeHastings > BigInt(0);
  const isFeeBelowMin = isValidFee && feeHastings < baseFeeHastings;

  // Other validations
  const zeroAmountNotAllowed = finalSendAmountHastings === BigInt(0);

  return {
    hasEnoughBalance,
    finalSendAmountHastings,
    isValidFee: isValidFee && !isFeeBelowMin,
    zeroAmountNotAllowed,
  };
};

const selectUtxosIfNeeded = async (
  hasEnoughBalance: boolean,
  sendAmountHastings: bigint,
  feeHastings: bigint,
  accountXpubOrAddress: string,
) => {
  let selectedUtxos: ISiaUtxo[] = [];
  let changeAmountHastings = '0';

  if (hasEnoughBalance && sendAmountHastings > BigInt(0)) {
    try {
      const utxosResponse = await getUtxos(accountXpubOrAddress);
      const availableUTXOs = utxosResponse.utxos;

      const selection = selectCoins(
        availableUTXOs,
        sendAmountHastings,
        feeHastings,
      );

      selectedUtxos = selection.selected;
      changeAmountHastings = selection.change.toString();
    } catch (error) {
      selectedUtxos = [];
    }
  }

  return { selectedUtxos, changeAmountHastings };
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

  const amountsAndFees = processAmountsAndFees(txn, output);
  const { feeSC, output: processedOutput } = amountsAndFees;
  let { sendAmountSC, sendAmountHastings, feeHastings } = amountsAndFees;

  const balanceSC = await getBalance(account.xpubOrAddress);
  const balanceHastings = BigInt(scToHastings(balanceSC));

  let currentTxn = txn;
  let currentOutput = processedOutput;

  if (txn.userInputs.isSendAll) {
    const sendAllResult = handleSendAll(
      currentTxn,
      currentOutput,
      balanceHastings,
      feeHastings,
    );
    sendAmountHastings = sendAllResult.sendAmountHastings;
    sendAmountSC = sendAllResult.sendAmountSC;
    currentOutput = sendAllResult.output;
    currentTxn = sendAllResult.txn;
    feeHastings = BigInt(scToHastings(feeSC));
  }

  const validationResult = validateBalanceAndFees(
    sendAmountSC,
    sendAmountHastings,
    feeHastings,
    balanceHastings,
    currentTxn,
  );

  let { hasEnoughBalance } = validationResult;
  const { finalSendAmountHastings, isValidFee, zeroAmountNotAllowed } =
    validationResult;

  const ownOutputAddressNotAllowed =
    currentOutput.address === account.xpubOrAddress;

  // Early return for invalid address
  if (!currentOutput.address || !outputsValidation[0]) {
    const finalValidation = {
      outputs: outputsValidation,
      hasEnoughBalance,
      isValidFee,
      ownOutputAddressNotAllowed: [ownOutputAddressNotAllowed],
      zeroAmountNotAllowed,
    };

    return {
      ...currentTxn,
      validation: finalValidation,
      computedData: {
        fees: currentTxn.userInputs.fees,
        output: currentOutput,
        selectedUtxos: [],
        changeAmount: '0',
      },
    };
  }

  const { selectedUtxos, changeAmountHastings } = await selectUtxosIfNeeded(
    hasEnoughBalance,
    finalSendAmountHastings,
    feeHastings,
    account.xpubOrAddress,
  );

  if (
    hasEnoughBalance &&
    finalSendAmountHastings > BigInt(0) &&
    selectedUtxos.length === 0
  ) {
    hasEnoughBalance = false;
  }

  const finalValidation = {
    outputs: outputsValidation,
    hasEnoughBalance,
    isValidFee,
    ownOutputAddressNotAllowed: [ownOutputAddressNotAllowed],
    zeroAmountNotAllowed,
  };

  const result = {
    ...currentTxn,
    validation: finalValidation,
    computedData: {
      fees: currentTxn.userInputs.fees,
      output: currentOutput,
      selectedUtxos,
      changeAmount: changeAmountHastings,
    },
  };

  return result;
};
