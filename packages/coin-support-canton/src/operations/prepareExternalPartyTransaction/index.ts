import { hexToBase64 } from '@cypherock/sdk-utils';

import { IPrepareCantonExternalPartyTransactionParams } from './types';

import { prepareExternalPartyTxn } from '../../services';
import { IPreparedCantonExternalPartyTransaction } from '../transaction';

export const prepareExternalPartyTransaction = async (
  params: IPrepareCantonExternalPartyTransactionParams,
): Promise<IPreparedCantonExternalPartyTransaction> => {
  const { account, accessToken } = params;

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
    account.xpubOrAddress,
    accessToken,
  );

  return {
    accountId: account.__id ?? '',
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
