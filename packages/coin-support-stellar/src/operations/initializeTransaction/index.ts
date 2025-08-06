import { IInitializeTransactionParams } from '@cypherock/coin-support-interfaces';
import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { stellarCoinList } from '@cypherock/coins';

import { getFees, getReserveBalance } from '../../services';
import { IPreparedStellarTransaction, StellarMemoType } from '../transaction';

export const initializeTransaction = async (
  params: IInitializeTransactionParams,
): Promise<IPreparedStellarTransaction> => {
  const { accountId, db } = params;
  const { account } = await getAccountAndCoin(db, stellarCoinList, accountId);

  const fees = await getFees(account.assetId);
  const { reserveBaseBalance } = await getReserveBalance(account.assetId);

  return {
    accountId,
    validation: {
      outputs: [],
      hasEnoughBalance: true,
      isValidFee: true,
      isFeeBelowMin: false,
      ownOutputAddressNotAllowed: [],
      zeroAmountNotAllowed: false,
      isAmountBelowStellarReserve: false,
      isBalanceBelowStellarReserve: false,
      isInvalidMemo: false,
    },
    userInputs: {
      outputs: [],
      isSendAll: false,
      fees,
    },
    staticData: {
      fees,
      reserveBaseBalance,
    },
    computedData: {
      output: {
        address: '',
        amount: '0',
        memo: {
          type: StellarMemoType.NONE,
        },
        isActivated: true, 
        isCreateAccount: false, 
      },
      fees: '0',
    },
  };
};
