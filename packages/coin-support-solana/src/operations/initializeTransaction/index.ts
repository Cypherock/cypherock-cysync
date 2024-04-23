import { IInitializeTransactionParams } from '@cypherock/coin-support-interfaces';
import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { solanaCoinList } from '@cypherock/coins';

import { getFees } from '../../services';
import { IPreparedSolanaTransaction } from '../transaction';

export const initializeTransaction = async (
  params: IInitializeTransactionParams,
): Promise<IPreparedSolanaTransaction> => {
  const { accountId, db } = params;
  const { coin } = await getAccountAndCoin(db, solanaCoinList, accountId);

  const fees = await getFees({ assetId: coin.id });

  return {
    accountId,
    validation: {
      outputs: [],
      hasEnoughBalance: true,
      isValidFee: true,
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
    },
  };
};
