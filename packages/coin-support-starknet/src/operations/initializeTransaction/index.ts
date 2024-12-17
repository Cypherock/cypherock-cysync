import { IInitializeTransactionParams } from '@cypherock/coin-support-interfaces';
import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { starknetCoinList } from '@cypherock/coins';

import { STRK_TOKEN_CONTRACT } from '../../constants';
import {
  estimateFees,
  getNonce,
  prepareInvokeTransaction,
} from '../../services';
import { IPreparedStarknetTransaction } from '../transaction';

export const initializeTransaction = async (
  params: IInitializeTransactionParams,
): Promise<IPreparedStarknetTransaction> => {
  const { accountId, db } = params;
  const { account } = await getAccountAndCoin(db, starknetCoinList, accountId);

  const nonce = await getNonce(account.xpubOrAddress, account.assetId);

  const transaction = prepareInvokeTransaction({
    address: account.xpubOrAddress,
    contractAddress: STRK_TOKEN_CONTRACT,
    recipientAddress: account.xpubOrAddress,
    amount: '0x0',
    nonce,
    resourceBounds: {
      l1_gas: { max_amount: '0x0', max_price_per_unit: '0x0' },
      l2_gas: { max_amount: '0x0', max_price_per_unit: '0x0' },
    },
  });

  const feeData = await estimateFees({ transaction, assetId: account.assetId });

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
      fees: feeData.suggestedMaxFee,
      nonce,
    },
    computedData: {
      output: { address: '', amount: '0' },
      feeData,
    },
  };
};
