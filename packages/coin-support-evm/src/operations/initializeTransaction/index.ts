import { IInitializeTransactionParams } from '@cypherock/coin-support-interfaces';
import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { evmCoinList } from '@cypherock/coins';

import { getAverageGasPrice } from '../../services';
import { IPreparedEvmTransaction } from '../transaction';
import { AccountTypeMap } from '@cypherock/db-interfaces';
import { assert } from '@cypherock/cysync-utils';

export const initializeTransaction = async (
  params: IInitializeTransactionParams,
): Promise<IPreparedEvmTransaction> => {
  const { accountId, db } = params;
  const { coin, account } = await getAccountAndCoin(db, evmCoinList, accountId);

  // disable support for token transactions
  assert(
    account.type === AccountTypeMap.account,
    new Error('Transaction from account not supported'),
  );

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
