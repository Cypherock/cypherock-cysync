import { IInitializeTransactionParams } from '@cypherock/coin-support-interfaces';

import { estimateFee } from '../../services';
import { IPreparedStarknetTransaction } from '../transaction';

export const initializeTransaction = async (
  params: IInitializeTransactionParams,
): Promise<IPreparedStarknetTransaction> => {
  const { accountId } = params;

  const fees = await estimateFee('transfer');

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
      txnType: 'deploy',
    },
    staticData: {
      txnType: 'deploy',
      maxFee: `${fees}`,
    },
    computedData: {
      output: { address: '', amount: '0' },
      maxFee: fees.suggestedMaxFee ?? '0x8110e6d36a8',
      data: '',
    },
  };
};
