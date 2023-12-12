import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { solanaCoinList, ICoinInfo } from '@cypherock/coins';
import { assert, BigNumber } from '@cypherock/cysync-utils';

import { IPrepareSolanaTransactionParams } from './types';

import { getFees } from '../../services';
import { IPreparedSolanaTransaction } from '../transaction';
import { validateAddress } from '../validateAddress';

const validateAddresses = (
  params: IPrepareSolanaTransactionParams,
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
  params: IPrepareSolanaTransactionParams,
): Promise<IPreparedSolanaTransaction> => {
  const { accountId, db, txn } = params;
  const { account, coin } = await getAccountAndCoin(
    db,
    solanaCoinList,
    accountId,
  );

  assert(
    txn.userInputs.outputs.length === 1,
    new Error('Solana transaction requires exactly 1 output'),
  );

  const outputsAddresses = validateAddresses(params, coin);
  const output = { ...txn.userInputs.outputs[0] };
  // Amount shouldn't have any decimal value as it's in lowest unit
  output.amount = new BigNumber(output.amount).toFixed(0);

  const fetchedFee = await getFees({ assetId: coin.id });

  const fee = new BigNumber(fetchedFee);

  let hasEnoughBalance: boolean;

  let sendAmount = new BigNumber(output.amount);
  if (txn.userInputs.isSendAll) {
    sendAmount = new BigNumber(
      BigNumber.max(new BigNumber(account.balance).minus(fee), 0).toFixed(0),
    );

    output.amount = sendAmount.toString(10);

    // update userInput so that the max amount is editable & not reset to 0
    txn.userInputs.outputs[0].amount = output.amount;
  }
  hasEnoughBalance = new BigNumber(account.balance).isGreaterThanOrEqualTo(
    sendAmount.plus(fee),
  );
  const isValidFee = fee.isGreaterThan(0);
  hasEnoughBalance =
    new BigNumber(txn.userInputs.outputs[0].amount).isNaN() || hasEnoughBalance;

  return {
    ...txn,
    validation: {
      outputs: outputsAddresses,
      hasEnoughBalance,
      isValidFee,
    },
    computedData: {
      fees: fetchedFee,
      output,
    },
  };
};
