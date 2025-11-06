import { hexToBase64 } from '@cypherock/sdk-utils';

import { IBroadcastCantonExternalPartyTransactionParams } from './types';

import { broadcastExternalPartyTransactionToBlockchain } from '../../services';

export const broadcastExternalPartyTransaction = async (
  params: IBroadcastCantonExternalPartyTransactionParams,
): Promise<void> => {
  const { signedTransaction, transaction, keyDB } = params;

  await broadcastExternalPartyTransactionToBlockchain(
    {
      signature: hexToBase64(signedTransaction),
      preparedParty: transaction.computedData.preparedTransaction,
    },
    keyDB,
  );
};
