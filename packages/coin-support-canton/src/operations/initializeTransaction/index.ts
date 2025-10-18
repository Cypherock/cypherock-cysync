import { IInitializeTransactionParams } from '@cypherock/coin-support-interfaces';
import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { cantonCoinList } from '@cypherock/coins';

import { getFees } from '../../services';
import { IPreparedCantonTransaction } from '../transaction';

export const initializeTransaction = async (
  params: IInitializeTransactionParams,
): Promise<IPreparedCantonTransaction> => {
  const { accountId, db } = params;
  const { account } = await getAccountAndCoin(db, cantonCoinList, accountId);

  const fees = await getFees(account.assetId);

  return {
    accountId,
    validation: {
      outputs: [],
      hasEnoughBalance: true,
      isValidFee: true,
      isFeeBelowMin: false,
      ownOutputAddressNotAllowed: [],
      zeroAmountNotAllowed: false,
      isInvalidExpiry: false,
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
      fees: '0',
    },
  };
};
