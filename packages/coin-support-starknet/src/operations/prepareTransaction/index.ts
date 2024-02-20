import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { starknetCoinList } from '@cypherock/coins';
import { assert, BigNumber } from '@cypherock/cysync-utils';
import { IAccount } from '@cypherock/db-interfaces';

import { IPrepareStarknetTransactionParams } from './types';

import { estimateFee } from '../../services';
import { IPreparedStarknetTransaction } from '../transaction';
import { validateAddress } from '../validateAddress';

const validateAddresses = (params: IPrepareStarknetTransactionParams) => {
  const outputAddressValidation: boolean[] = [];

  for (const output of params.txn.userInputs.outputs) {
    let isValid = true;

    /**
     * We allow empty string in the validation (error prompt should not
     * appear for empty string). And validate only non-empty strings.
     */
    if (output.address && !validateAddress(output.address)) {
      isValid = false;
    }

    outputAddressValidation.push(isValid);
  }

  return outputAddressValidation;
};

async function estimateFees(params: {
  account: IAccount;
  toAddressForEstimate: string;
  data: string;
  txn: IPreparedStarknetTransaction;
}) {
  const { account, toAddressForEstimate, data, txn } = params;

  const gasEstimate = await estimateFee(
    txn.userInputs.txnType ?? txn.staticData.txnType,
    {
      from: account.xpubOrAddress,
      to: toAddressForEstimate,
      value: '0',
      data,
    },
  );

  const fee = txn.userInputs.maxFee ?? gasEstimate.suggestedMaxFee;
  if (typeof fee !== 'string') {
    return fee?.toString(16);
  }
  return fee;
}

export const prepareTransaction = async (
  params: IPrepareStarknetTransactionParams,
): Promise<IPreparedStarknetTransaction> => {
  const { accountId, db, txn } = params;
  const { account } = await getAccountAndCoin(db, starknetCoinList, accountId);
  assert(
    txn.userInputs.outputs.length === 1 || txn.userInputs.txnType === 'deploy',
    new Error('Starknet transaction requires exactly 1 output'),
  );

  const outputsAddresses = validateAddresses(params);
  const output = { ...txn.userInputs.outputs[0] };
  // Amount shouldn't have any decimal value as it's in lowest unit
  output.amount = new BigNumber(output.amount).toFixed(0);

  const { data } = txn.computedData;

  let toAddressForEstimate = account.xpubOrAddress;
  if (outputsAddresses[0] && output.address)
    toAddressForEstimate = output.address;

  return {
    ...txn,
    validation: {
      outputs: outputsAddresses,
      hasEnoughBalance: false,
      isValidFee: true,
    },
    computedData: {
      maxFee:
        (await estimateFees({ account, data, toAddressForEstimate, txn })) ??
        txn.staticData.maxFee,
      output,
      data,
    },
  };
};
