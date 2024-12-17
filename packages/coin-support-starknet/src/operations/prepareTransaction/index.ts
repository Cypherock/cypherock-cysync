import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { starknetCoinList, ICoinInfo } from '@cypherock/coins';
import { assert, BigNumber } from '@cypherock/cysync-utils';
import { IAccount } from '@cypherock/db-interfaces';

import { IPrepareStarknetTransactionParams } from './types';

import { STRK_TOKEN_CONTRACT } from '../../constants';
import { estimateFees, prepareInvokeTransaction } from '../../services';
import { IPreparedStarknetTransaction } from '../transaction';
import { validateAddress } from '../validateAddress';

const validateAddresses = (
  params: IPrepareStarknetTransactionParams,
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

const estimateTransactionFees = async (
  account: IAccount,
  recipientAddress: string,
  amount: string,
  nonce: string,
) => {
  const transaction = prepareInvokeTransaction({
    address: account.xpubOrAddress,
    contractAddress: STRK_TOKEN_CONTRACT,
    recipientAddress,
    amount,
    nonce,
    resourceBounds: {
      l1_gas: { max_amount: '0x0', max_price_per_unit: '0x0' },
      l2_gas: { max_amount: '0x0', max_price_per_unit: '0x0' },
    },
  });

  return estimateFees({ transaction, assetId: account.assetId });
};

export const prepareTransaction = async (
  params: IPrepareStarknetTransactionParams,
): Promise<IPreparedStarknetTransaction> => {
  const { accountId, db, txn } = params;
  const { account, coin } = await getAccountAndCoin(
    db,
    starknetCoinList,
    accountId,
  );

  assert(
    txn.userInputs.outputs.length === 1,
    new Error('Starknet transaction requires exactly 1 output'),
  );

  const outputsValidation = validateAddresses(params, coin);

  const output = { ...txn.userInputs.outputs[0] };

  // Amount shouldn't have any decimal value as it's in lowest unit
  output.amount = new BigNumber(output.amount).toFixed(0);
  let sendAmount = new BigNumber(output.amount);

  const feeData =
    sendAmount.isNaN() || output.address === ''
      ? txn.computedData.feeData
      : await estimateTransactionFees(
          account,
          output.address,
          output.amount,
          txn.staticData.nonce,
        );
  const { suggestedMaxFee: fees } = feeData;

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

  return {
    ...txn,
    validation: {
      outputs: outputsValidation,
      hasEnoughBalance,
      isValidFee: true,
      ownOutputAddressNotAllowed: [],
      zeroAmountNotAllowed: false,
    },
    computedData: {
      feeData,
      output,
    },
  };
};
