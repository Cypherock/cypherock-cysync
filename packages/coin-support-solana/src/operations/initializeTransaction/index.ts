import { IInitializeTransactionParams } from '@cypherock/coin-support-interfaces';
import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { solanaCoinList } from '@cypherock/coins';
import { BigNumber } from '@cypherock/cysync-utils';

import {
  getFees,
  getPriorityFees,
  getSimulationComputeUnits,
} from '../../services';

import { IPreparedSolanaTransaction } from '../transaction';
import { AccountTypeMap } from '@cypherock/db-interfaces';
import {
  constructTransaction,
  ICustomSolanaInstruction,
  ICustomSolanaTransferCheckedInstruction,
  ICustomSolanaTransferInstruction,
  InstructionType,
} from '../../utils';
import logger from '../../utils/logger';

export const initializeTransaction = async (
  params: IInitializeTransactionParams,
): Promise<IPreparedSolanaTransaction> => {
  const { accountId, db } = params;
  const { coin, account } = await getAccountAndCoin(
    db,
    solanaCoinList,
    accountId,
  );

  const isTokenAccount = account.type === AccountTypeMap.subAccount;

  // create a dummy txn for fee estimation
  const instructions: ICustomSolanaInstruction[] = [];
  if (isTokenAccount) {
    const tokenDetails =
      solanaCoinList[account.parentAssetId].tokens[account.assetId];
    const instruction: ICustomSolanaTransferCheckedInstruction = {
      type: InstructionType.transferChecked,
      amount: 5,
      recipient: account.xpubOrAddress,
      mintAddress: tokenDetails.address,
      decimals: tokenDetails.decimals,
    };
    instructions.push(instruction);
  } else {
    const instruction: ICustomSolanaTransferInstruction = {
      type: InstructionType.transfer,
      amount: 5,
      recipient: account.xpubOrAddress,
    };
    instructions.push(instruction);
  }

  const transaction = await constructTransaction(
    coin.id,
    account.xpubOrAddress,
    instructions,
  );

  let fees = await getFees(
    transaction.serializeMessage().toString('base64'),
    coin.id,
  );

  let computeUnits = 200_000; // Fallback value for computeunits
  try {
    computeUnits = await getSimulationComputeUnits(
      transaction
        .serialize({ requireAllSignatures: false, verifySignatures: false })
        .toString('base64'),
      coin.id,
    );
  } catch (e) {
    logger.warn('Failed to simulate transaction');
    logger.warn(JSON.stringify(e));
  }

  let computeUnitPriceMicroLamports = 0; // Fallback value for computeprice
  try {
    computeUnitPriceMicroLamports = await getPriorityFees(coin.id);
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

  return {
    accountId,
    validation: {
      outputs: [],
      hasEnoughBalance: true,
      isValidFee: true,
      ownOutputAddressNotAllowed: [],
      zeroAmountNotAllowed: false,
      isRentExemptFeeRequired: false,
    },
    userInputs: {
      outputs: [],
      isSendAll: false,
    },
    staticData: {
      fees,
    },
    computedData: {
      output: { address: '', amount: '0' },
      fees,
      instructions: [],
      computeUnits,
      computeUnitPriceMicroLamports,
    },
  };
};
