import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { cantonCoinList } from '@cypherock/coins';

import {
  IPrepareCantonMergeDelegationProposalTransactionParams,
  IPreparedCantonMergeDelegationProposalTransaction,
} from './types';

import { prepareMergeDelegationProposalTxn } from '../../services';

export const prepareMergeDelegationProposalTransaction = async (
  params: IPrepareCantonMergeDelegationProposalTransactionParams,
): Promise<IPreparedCantonMergeDelegationProposalTransaction> => {
  const { accountId, db, keyDB } = params;
  const { account } = await getAccountAndCoin(db, cantonCoinList, accountId);

  const preparedTransaction = await prepareMergeDelegationProposalTxn(
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
