import { IInitializeTransactionParams } from '@cypherock/coin-support-interfaces';
import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { xrpCoinList } from '@cypherock/coins';

import { getFees } from '../../services';
import { IPreparedXrpTransaction } from '../transaction';

export const initializeTransaction = async (
  params: IInitializeTransactionParams,
): Promise<IPreparedXrpTransaction> => {
  const { accountId, db } = params;
  const { account } = await getAccountAndCoin(db, xrpCoinList, accountId);

  const fees = await getFees(account.assetId);

  return {
    accountId,
    validation: {
      outputs: [],
      hasEnoughBalance: true,
      isValidFee: true,
      isFeeBelowMin: false,
      ownOutputAddressNotAllowed: [],
      zeroAmountNotAllowed: false,
      isAmountBelowXrpReserveAllowed: true,
      isBalanceBelowXrpReserve: false,
      isValidDestinationTag: true,
    },
    userInputs: {
      outputs: [],
      isSendAll: false,
      fees,
    },
    staticData: {
      fees,
    },
    computedData: {
      output: { address: '', amount: '0' },
      fees: '0',
    },
  };
};
