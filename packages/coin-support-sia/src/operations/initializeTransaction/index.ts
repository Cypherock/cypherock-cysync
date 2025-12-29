import { IInitializeTransactionParams } from '@cypherock/coin-support-interfaces';

import { getFees } from '../../services';
import { IPreparedSiaTransaction } from '../transaction';

export const initializeTransaction = async (
  params: IInitializeTransactionParams,
): Promise<IPreparedSiaTransaction> => {
  const { accountId } = params;
  const fees = await getFees();

  return {
    accountId,
    validation: {
      outputs: [],
      hasEnoughBalance: true,
      isValidFee: true,
      ownOutputAddressNotAllowed: [],
      zeroAmountNotAllowed: false,
    },
    userInputs: {
      outputs: [],
      isSendAll: false,
      fees: fees.recommendedFee,
    },
    staticData: {
      fees,
    },
    computedData: {
      output: { address: '', amount: '0' },
      fees: fees.recommendedFee,
      selectedUtxos: [],
      changeAmount: '0',
    },
  };
};
