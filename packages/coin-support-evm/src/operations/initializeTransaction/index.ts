import { IInitializeTransactionParams } from '@cypherock/coin-support-interfaces';
import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { evmCoinList } from '@cypherock/coins';
import { BigNumber, assert } from '@cypherock/cysync-utils';
import { AccountTypeMap } from '@cypherock/db-interfaces';

import { getAverageGasPrice } from '../../services';
import { IPreparedEvmTransaction } from '../transaction';

export const initializeTransaction = async (
  params: IInitializeTransactionParams,
): Promise<IPreparedEvmTransaction> => {
  const { accountId, db } = params;
  const { coin, account } = await getAccountAndCoin(db, evmCoinList, accountId);

  // disable support for token transactions
  assert(
    account.type === AccountTypeMap.account,
    new Error('Transaction from subAccount not supported'),
  );

  const gasLimit = '21000';
  const averageGasPrice = await getAverageGasPrice(coin.id);
  const fee = new BigNumber(gasLimit).multipliedBy(averageGasPrice);

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
      fee: fee.toString(10),
      gasLimit,
      gasLimitEstimate: gasLimit,
      gasPrice: averageGasPrice,
    },
  };
};
