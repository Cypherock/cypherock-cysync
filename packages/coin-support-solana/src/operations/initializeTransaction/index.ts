import { IInitializeTransactionParams } from '@cypherock/coin-support-interfaces';
import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { solanaCoinList } from '@cypherock/coins';

import { constructTransaction, getFees } from '../../services';
import { IPreparedSolanaTransaction } from '../transaction';
import { AccountTypeMap } from '@cypherock/db-interfaces';
import { InstructionType } from '../../services/helpers/common';
import { ISolanaSplTokenAccount } from '../types';

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
  const transaction = await constructTransaction(
    coin.id,
    account.xpubOrAddress,
    [
      {
        type: isTokenAccount
          ? InstructionType.transferChecked
          : InstructionType.transfer,
        amount: 5,
        recipient: account.xpubOrAddress,
        mintAddress: isTokenAccount
          ? (account as ISolanaSplTokenAccount).extraData.contractAddress
          : undefined,
      },
    ],
  );

  const fees = await getFees(
    transaction.serializeMessage().toString('base64'),
    coin.id,
  );

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
    },
  };
};
