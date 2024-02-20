import { IInitializeTransactionParams } from '@cypherock/coin-support-interfaces';
import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { starknetCoinList } from '@cypherock/coins';

import { estimateFee } from '../../services';
import { IPreparedStarknetTransaction } from '../transaction';

export const initializeTransaction = async (
  params: IInitializeTransactionParams,
): Promise<IPreparedStarknetTransaction> => {
  const { accountId, db } = params;
  const { account } = await getAccountAndCoin(db, starknetCoinList, accountId);

  const fees = await estimateFee('transfer', {
    data: '',
    from: account.xpubOrAddress,
    to: '',
    value: '0',
  });

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
      txnType: 'transfer',
      maxFee: `${fees}`,
    },
    computedData: {
      output: { address: '', amount: '0' },
      maxFee: fees.suggestedMaxFee?.toString(16) ?? '0x8110e6d36a8',
      data: '',
    },
  };
};
