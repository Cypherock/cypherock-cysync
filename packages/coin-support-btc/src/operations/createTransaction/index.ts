import { ICreateTransactionParams } from '@cypherock/coin-support-interfaces';
import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { btcCoinList } from '@cypherock/coins';

import { getAverageFee, getUtxos } from '../../services';
import { IPreparedBtcTransaction } from '../transaction';

export const createTransaction = async (
  params: ICreateTransactionParams,
): Promise<IPreparedBtcTransaction> => {
  const { accountId, db } = params;
  const { account, coin } = await getAccountAndCoin(db, btcCoinList, accountId);

  const [averageFee, utxos] = await Promise.all([
    getAverageFee(coin),
    getUtxos({ xpub: account.xpubOrAddress, coinId: coin.id }),
  ]);

  return {
    accountId,
    validation: {
      outputs: [],
      hasEnoughBalance: true,
    },
    userInputs: {
      outputs: [],
      feeRate: averageFee,
    },
    staticData: {
      averageFee,
      utxos,
    },
    computedData: {
      fee: 0,
      inputs: [],
      outputs: [],
    },
  };
};
