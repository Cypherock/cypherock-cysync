import { IInitializeTransactionParams } from '@cypherock/coin-support-interfaces';
import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { evmCoinList } from '@cypherock/coins';
import { BigNumber } from '@cypherock/cysync-utils';

import { getAverageGasPrice } from '../../services';
import { IPreparedEvmTransaction } from '../transaction';

export const initializeTransaction = async (
  params: IInitializeTransactionParams,
): Promise<IPreparedEvmTransaction> => {
  const { accountId, db } = params;
  const { coin } = await getAccountAndCoin(db, evmCoinList, accountId);

  const gasLimit = '21000';
  const averageGasPrice = await getAverageGasPrice(coin.id);
  const fee = new BigNumber(gasLimit).multipliedBy(averageGasPrice);

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
      averageGasPrice,
    },
    computedData: {
      output: { address: '', amount: '0' },
      fee: fee.toString(10),
      gasLimit,
      data: '0x',
      gasLimitEstimate: gasLimit,
      l1Fee: '0',
      gasPrice: averageGasPrice,
    },
  };
};
