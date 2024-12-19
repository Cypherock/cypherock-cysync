import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import * as services from '../../services';
import {
  IPreparedStarknetDeployAccountTransaction,
  IPrepareStarknetDeployAccountTransactionParams,
} from './types';
import { starknetCoinList } from '@cypherock/coins';
import { BigNumber } from '@cypherock/cysync-utils';

export const prepareDeployAccountTransaction = async (
  params: IPrepareStarknetDeployAccountTransactionParams,
): Promise<IPreparedStarknetDeployAccountTransaction> => {
  const { db, accountId } = params;
  const { account } = await getAccountAndCoin(db, starknetCoinList, accountId);

  const nonce = await services.getNonce(account.xpubOrAddress, account.assetId);

  const transaction = services.prepareDeployAccountTransaction({
    assetId: account.assetId,
    nonce,
    resourceBounds: {
      l1_gas: { max_amount: '0x0', max_price_per_unit: '0x0' },
      l2_gas: { max_amount: '0x0', max_price_per_unit: '0x0' },
    },
    salt: account.extraData?.salt,
  });

  const feeData = await services.estimateFees({
    transaction,
    assetId: account.assetId,
  });
  const chainId = await services.getChainId(account.assetId);

  const hasEnoughBalance = new BigNumber(
    account.balance,
  ).isGreaterThanOrEqualTo(feeData.suggestedMaxFee);

  return {
    accountId,
    computedData: {
      feeData,
      nonce,
      chainId,
    },
    validation: {
      outputs: [],
      hasEnoughBalance,
      isValidFee: true,
      ownOutputAddressNotAllowed: [],
      zeroAmountNotAllowed: false,
    },
    userInputs: {
      outputs: [],
      isSendAll: false,
    },
    staticData: {},
  };
};
