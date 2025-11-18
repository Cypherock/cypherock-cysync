import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { cantonCoinList } from '@cypherock/coins';

import {
  IPrepareCantonTransferPreApprovalTransactionParams,
  IPreparedCantonTransferPreApprovalTransaction,
} from './types';

import { prepareTransferPreApprovalTxn } from '../../services';

export const prepareTransferPreApprovalTransaction = async (
  params: IPrepareCantonTransferPreApprovalTransactionParams,
): Promise<IPreparedCantonTransferPreApprovalTransaction> => {
  const { accountId, db, keyDB } = params;
  const { account } = await getAccountAndCoin(db, cantonCoinList, accountId);

  const preparedTransaction = await prepareTransferPreApprovalTxn(
    account.xpubOrAddress,
    keyDB,
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
