import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { solanaCoinList, ICoinInfo, ISolanaSplToken } from '@cypherock/coins';
import { assert, BigNumber } from '@cypherock/cysync-utils';
import { AccountTypeMap, IAccount } from '@cypherock/db-interfaces';

import {
  constructTransaction,
  deriveAssociatedTokenAddress,
  ICustomSolanaCreateAccountInstruction,
  ICustomSolanaInstruction,
  ICustomSolanaTransferCheckedInstruction,
  ICustomSolanaTransferInstruction,
  InstructionType,
} from '../../utils';
import {
  doesAccountExist,
  getFees,
  getPriorityFees,
  getSimulationComputeUnits,
  getTokenAccountRentExemptFees,
} from '../../services';

import { IPreparedSolanaTransaction } from '../transaction';
import { validateAddress } from '../validateAddress';

import { IPrepareSolanaTransactionParams } from './types';
import logger from '../../utils/logger';

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

  let fees = await getFees(
    transaction.serializeMessage().toString('base64'),
    assetId,
  );

  let computeUnits = 10_000; // Fallback value for computeunits
  try {
    computeUnits = await getSimulationComputeUnits(
      transaction
        .serialize({ requireAllSignatures: false, verifySignatures: false })
        .toString('base64'),
      assetId,
    );
  } catch (e) {
    logger.warn('Failed to simulate transaction');
    logger.warn(JSON.stringify(e));
  }

  let computeUnitPriceMicroLamports = 100_000; // Fallback value for computeprice
  try {
    computeUnitPriceMicroLamports = await getPriorityFees(assetId);
  } catch (e) {
    logger.warn('Failed to fetch priority fees from server');
    logger.warn(JSON.stringify(e));
  }

  fees = new BigNumber(fees)
    .plus(
      new BigNumber(computeUnitPriceMicroLamports)
        .dividedBy(10 ** 6)
        .multipliedBy(computeUnits),
    )
    .toFixed(0);

  return { fees, computeUnits, computeUnitPriceMicroLamports };
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

  const spendableBalance = new BigNumber(
    new BigNumber(account.spendableBalance ?? account.balance).toFixed(0),
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
        type: InstructionType.createAccount,
        recipient: output.address,
        mintAddress: tokenDetails.address,
      } as ICustomSolanaCreateAccountInstruction);
    }
  }

  let fee = new BigNumber(txn.computedData.fees);
  let { computeUnitPriceMicroLamports, computeUnits } = txn.computedData;

  if (
    (!sendAmount.isNaN() || txn.userInputs.isSendAll) &&
    output.address !== '' &&
    outputsAddresses?.[0]
  ) {
    const amountToSend = sendAmount.isNaN() ? spendableBalance : sendAmount;

    if (tokenDetails) {
      const instruction: ICustomSolanaTransferCheckedInstruction = {
        type: InstructionType.transferChecked,
        amount: amountToSend.toNumber(),
        recipient: output.address,
        mintAddress: tokenDetails.address,
        decimals: tokenDetails.decimals,
      };
      instructions.push(instruction);
    } else {
      const instruction: ICustomSolanaTransferInstruction = {
        type: InstructionType.transfer,
        amount: amountToSend.minus(txn.staticData.baseFee).toNumber(),
        recipient: output.address,
      };
      instructions.push(instruction);
    }

    const estimatedFees = await estimateFees(
      account.xpubOrAddress,
      coin.id,
      instructions,
    );

    fee = new BigNumber(estimatedFees.fees);
    computeUnits = estimatedFees.computeUnits;
    computeUnitPriceMicroLamports = estimatedFees.computeUnitPriceMicroLamports;
  }

  fee = fee.plus(rentExemptFees);

  let hasEnoughBalance: boolean;

  if (txn.userInputs.isSendAll) {
    sendAmount = spendableBalance;

    if (!isTokenAccount) sendAmount = BigNumber.max(sendAmount.minus(fee), 0);

    output.amount = sendAmount.toFixed(0);

    // update the amount in transfer instruction
    if (instructions.length > 0) {
      (
        instructions[instructions.length - 1] as
          | ICustomSolanaTransferInstruction
          | ICustomSolanaTransferCheckedInstruction
      ).amount = new BigNumber(output.amount).toNumber();
    }

    // update userInput so that the max amount is editable & not reset to 0
    txn.userInputs.outputs[0].amount = output.amount;
  }

  const isValidFee = fee.isGreaterThan(0);

  hasEnoughBalance = isTokenAccount
    ? new BigNumber(parentAccount?.balance ?? 0).isGreaterThan(fee) &&
      spendableBalance.isGreaterThanOrEqualTo(sendAmount)
    : spendableBalance.isGreaterThanOrEqualTo(sendAmount.plus(fee));

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
      computeUnits,
      computeUnitPriceMicroLamports,
    },
  };
};
