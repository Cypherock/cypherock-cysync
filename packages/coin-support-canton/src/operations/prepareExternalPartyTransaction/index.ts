import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { cantonCoinList } from '@cypherock/coins';
import { hexToBase64 } from '@cypherock/sdk-utils';

import { IPrepareCantonExternalPartyTransactionParams } from './types';

import { prepareExternalPartyTxn } from '../../services';
import { IPreparedCantonExternalPartyTransaction } from '../transaction';

export const prepareExternalPartyTransaction = async (
  params: IPrepareCantonExternalPartyTransactionParams,
): Promise<IPreparedCantonExternalPartyTransaction> => {
  const { accountId, db } = params;
  const { account } = await getAccountAndCoin(db, cantonCoinList, accountId);

  if (!account.extraData?.publicKey) {
    throw new Error('Public key missing for the account');
  }

  const partyHint = account.xpubOrAddress.split('::')?.[0];
  if (!partyHint) {
    throw new Error(
      'Could not extract partyHint from the partyId of the account',
    );
  }

  const preparedTransaction = await prepareExternalPartyTxn(
    hexToBase64(account.extraData.publicKey),
    partyHint,
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
