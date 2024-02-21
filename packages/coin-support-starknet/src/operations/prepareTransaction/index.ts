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
  const { txn } = params;

  const gasEstimate = await estimateFee(
    txn.userInputs.txnType ?? txn.staticData.txnType,
  );

  const fee = txn.userInputs.maxFee ?? gasEstimate.suggestedMaxFee;
  return fee;
}

export const prepareTransaction = async (
  params: IPrepareStarknetTransactionParams,
): Promise<IPreparedStarknetTransaction> => {
  const { accountId, db, txn } = params;
  const { account } = await getAccountAndCoin(db, starknetCoinList, accountId);
  if (txn.userInputs.txnType !== 'deploy') {
    assert(
      txn.userInputs.outputs.length === 1,
      new Error('Starknet transaction requires exactly 1 output'),
    );
  }

  const outputsAddresses = validateAddresses(params);
  const output = { ...txn.userInputs.outputs[0] };
  // Amount shouldn't have any decimal value as it's in lowest unit
  output.amount = new BigNumber(output?.amount ?? '0').toFixed(0);

  const { data } = txn.computedData;

  const toAddressForEstimate = account.xpubOrAddress;
  const maxFee =
    (await estimateFees({ account, data, toAddressForEstimate, txn })) ??
    txn.staticData.maxFee;
  const isValidFee = new BigNumber(maxFee, 16).isGreaterThan(0);

  const resp = {
    ...txn,
    validation: {
      outputs: outputsAddresses,
      hasEnoughBalance: true,
      isValidFee,
    },
    computedData: {
      maxFee,
      output,
      data,
    },
  };
  return resp;
};
