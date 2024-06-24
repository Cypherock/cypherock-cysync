import { IInitializeTransactionParams } from '@cypherock/coin-support-interfaces';
import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { tronCoinList } from '@cypherock/coins';

import {
  getAccountsDetailByAddress,
  getAverageEnergyPrice,
} from '../../services';
import { IPreparedTronTransaction } from '../transaction';

export const initializeTransaction = async (
  params: IInitializeTransactionParams,
): Promise<IPreparedTronTransaction> => {
  const { accountId, db } = params;
  const { account } = await getAccountAndCoin(db, tronCoinList, accountId);

  const averageEnergyPrice = await getAverageEnergyPrice();
  const accountDetails = await getAccountsDetailByAddress(
    account.xpubOrAddress,
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
    staticData: {
      averageEnergyPrice,
      totalBandwidthAvailable:
        (accountDetails.details.bandwidthTotal ?? 0) -
        (accountDetails.details.bandwidthUsed ?? 0),
      totalEnergyAvailable:
        (accountDetails.details.energyTotal ?? 0) -
        (accountDetails.details.energyUsed ?? 0),
    },
    computedData: {
      output: { address: '', amount: '0' },
      fee: '0',
      bandwidth: 0,
    },
  };
};
