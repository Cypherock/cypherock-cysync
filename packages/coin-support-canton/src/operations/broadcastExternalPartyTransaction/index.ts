import { hexToBase64 } from '@cypherock/sdk-utils';

import { IBroadcastCantonExternalPartyTransactionParams } from './types';

import { broadcastExternalPartyTransactionToBlockchain } from '../../services';

export const broadcastExternalPartyTransaction = async (
  params: IBroadcastCantonExternalPartyTransactionParams,
): Promise<void> => {
  const { signedTransaction, transaction } = params;

  await broadcastExternalPartyTransactionToBlockchain(
    hexToBase64(signedTransaction),
    transaction.computedData.preparedTransaction,
  );
};
