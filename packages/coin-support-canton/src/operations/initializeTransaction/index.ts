import { IInitializeTransactionParams } from '@cypherock/coin-support-interfaces';

import { IPreparedCantonTransaction } from '../transaction';

export const initializeTransaction = async (
  params: IInitializeTransactionParams,
): Promise<IPreparedCantonTransaction> => {
  const { accountId } = params;

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
      fees: '0',
    },
    computedData: {
      output: { address: '', amount: '0' },
      fees: '0',
    },
  };
};
