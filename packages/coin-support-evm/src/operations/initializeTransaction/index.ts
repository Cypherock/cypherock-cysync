import { IInitializeTransactionParams } from '@cypherock/coin-support-interfaces';
import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { evmCoinList } from '@cypherock/coins';

import { getAverageGasPrice } from '../../services';
import { IPreparedEvmTransaction } from '../transaction';

export const initializeTransaction = async (
  params: IInitializeTransactionParams,
): Promise<IPreparedEvmTransaction> => {
  const { accountId, db } = params;
  const { coin } = await getAccountAndCoin(db, evmCoinList, accountId);

  const averageGasPrice = await getAverageGasPrice(coin.id);

  return {
    accountId,
    validation: {
      outputs: [],
      hasEnoughBalance: true,
    },
    userInputs: {
      outputs: [],
      isSendAll: false,
    },
    staticData: {
      averageGasPrice,
    },
    computedData: {
      output: { address: '', amount: '0' },
      fee: '0',
      gasLimit: '0',
      gasPrice: '0',
    },
  };
};
