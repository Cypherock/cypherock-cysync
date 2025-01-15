import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { solanaCoinList, ICoinInfo, ISolanaSplToken } from '@cypherock/coins';
import { assert, BigNumber } from '@cypherock/cysync-utils';

import { IPrepareSolanaTransactionParams } from './types';

import {
  constructTransaction,
  doesAccountExist,
  getFees,
  getTokenAccountRentExemptFees,
  ICustomSolanaInstruction,
} from '../../services';
import { IPreparedSolanaTransaction } from '../transaction';
import { validateAddress } from '../validateAddress';
import { AccountTypeMap, IAccount } from '@cypherock/db-interfaces';
import { InstructionType } from '../../services/helpers/common';
import { deriveAssociatedTokenAddress } from '../../utils';

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

const checkIfRecipientTokenAccountExists = async (
  account: IAccount,
  recipientAddress: string,
  assetId: string,
  mintAddress: string,
) => {
  const outputTokenAccountAddress = deriveAssociatedTokenAddress(
    recipientAddress,
    mintAddress,
  );

  return doesAccountExist(outputTokenAccountAddress, assetId);
};

const estimateFees = async (
  address: string,
  assetId: string,
  instructions: ICustomSolanaInstruction[],
) => {
  const transaction = await constructTransaction(
    assetId,
    address,
    instructions,
  );

  return getFees(transaction.serializeMessage().toString('base64'), assetId);
};

export const prepareTransaction = async (
  params: IPrepareSolanaTransactionParams,
): Promise<IPreparedSolanaTransaction> => {
  const { accountId, db, txn } = params;
  const { account, coin, parentAccount } = await getAccountAndCoin(
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

  let sendAmount = new BigNumber(output.amount);

  const instructions: ICustomSolanaInstruction[] = [];

  const isTokenAccount = account.type === AccountTypeMap.subAccount;
  let tokenDetails: ISolanaSplToken | undefined;
  if (isTokenAccount)
    tokenDetails =
      solanaCoinList[account.parentAssetId].tokens[account.assetId];

  let rentExemptFees = new BigNumber(0);
  if (tokenDetails && output.address !== '' && outputsAddresses?.[0]) {
    const doesExist = await checkIfRecipientTokenAccountExists(
      account,
      output.address,
      coin.id,
      tokenDetails.address,
    );

    if (!doesExist) {
      rentExemptFees = new BigNumber(
        await getTokenAccountRentExemptFees(coin.id),
      );

      instructions.push({
        type: InstructionType.create,
        recipient: output.address,
        mintAddress: tokenDetails.address,
      });
    }
  }

  let fee = new BigNumber(txn.computedData.fees);

  if (
    (!sendAmount.isNaN() || txn.userInputs.isSendAll) &&
    output.address !== '' &&
    outputsAddresses?.[0]
  ) {
    instructions.push({
      type: tokenDetails
        ? InstructionType.transferChecked
        : InstructionType.transfer,
      amount: sendAmount.isNaN()
        ? new BigNumber(account.balance).toNumber()
        : sendAmount.toNumber(),
      recipient: output.address,
      mintAddress: tokenDetails?.address,
    });

    fee = new BigNumber(
      await estimateFees(account.xpubOrAddress, coin.id, instructions),
    );
  }

  fee = fee.plus(rentExemptFees);

  let hasEnoughBalance: boolean;

  if (txn.userInputs.isSendAll) {
    sendAmount = new BigNumber(account.balance);

    if (!isTokenAccount)
      sendAmount = new BigNumber(
        BigNumber.max(sendAmount.minus(fee), 0).toFixed(0),
      );

    output.amount = sendAmount.toString(10);

    // update userInput so that the max amount is editable & not reset to 0
    txn.userInputs.outputs[0].amount = output.amount;
  }

  const isValidFee = fee.isGreaterThan(0);

  hasEnoughBalance = isTokenAccount
    ? new BigNumber(parentAccount?.balance ?? 0).isGreaterThan(fee) &&
      new BigNumber(account.balance).isGreaterThanOrEqualTo(sendAmount)
    : new BigNumber(account.balance).isGreaterThanOrEqualTo(
        sendAmount.plus(fee),
      );

  hasEnoughBalance =
    new BigNumber(txn.userInputs.outputs[0].amount).isNaN() || hasEnoughBalance;

  return {
    ...txn,
    validation: {
      outputs: outputsAddresses,
      hasEnoughBalance,
      isValidFee,
      ownOutputAddressNotAllowed: [],
      zeroAmountNotAllowed: false,
      isRentExemptFeeRequired: !rentExemptFees.isZero(),
    },
    computedData: {
      fees: fee.toString(),
      output,
      instructions,
    },
  };
};
