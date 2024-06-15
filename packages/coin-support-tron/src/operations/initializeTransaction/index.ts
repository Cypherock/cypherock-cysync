import { IInitializeTransactionParams } from '@cypherock/coin-support-interfaces';

import { IPreparedTronTransaction } from '../transaction';

export const initializeTransaction = async (
  params: IInitializeTransactionParams,
): Promise<IPreparedTronTransaction> => {
  const { accountId } = params;

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
    staticData: {},
    computedData: {
      output: { address: '', amount: '0' },
      fee: '0',
    },
  };
};
