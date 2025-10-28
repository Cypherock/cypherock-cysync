import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { cantonCoinList } from '@cypherock/coins';

import {
  IPrepareCantonChoiceTransactionParams,
  IPreparedCantonChoiceTransaction,
} from './types';

import { prepareChoiceTxn } from '../../services';

export const prepareChoiceTransaction = async (
  params: IPrepareCantonChoiceTransactionParams,
): Promise<IPreparedCantonChoiceTransaction> => {
  const { accountId, db, txn, choice } = params;
  const { account } = await getAccountAndCoin(db, cantonCoinList, accountId);

  if (!txn.extraData?.contractId) {
    throw new Error('Canton choice transaction requires contract id');
  }

  const preparedTransaction = await prepareChoiceTxn(
    account.xpubOrAddress,
    txn.extraData.contractId,
    choice,
  );

  return {
    accountId,
    validation: {
      outputs: [],
      hasEnoughBalance: true,
      isValidFee: true,
      ownOutputAddressNotAllowed: [],
      zeroAmountNotAllowed: false,
    },
    userInputs: {
      outputs: [],
      isSendAll: false,
    },
    staticData: {},
    computedData: {
      preparedTransaction,
    },
  };
};
