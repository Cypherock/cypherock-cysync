import { IInitializeTransactionParams } from '@cypherock/coin-support-interfaces';
import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { btcCoinList } from '@cypherock/coins';

import { getAverageFee, getUtxos } from '../../services';
import { IPreparedBtcTransaction } from '../transaction';

export const initializeTransaction = async (
  params: IInitializeTransactionParams,
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
      isValidFee: true,
      isNotOverDustThreshold: false,
    },
    userInputs: {
      outputs: [],
      feeRate: averageFee,
      isSendAll: false,
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
