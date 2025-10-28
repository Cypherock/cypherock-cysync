import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { cantonCoinList } from '@cypherock/coins';
import { hexToBase64 } from '@cypherock/sdk-utils';

import { IBroadcastCantonChoiceTransactionParams } from './types';

import { broadcastTransactionToBlockchain } from '../../services';

export const broadcastChoiceTransaction = async (
  params: IBroadcastCantonChoiceTransactionParams,
): Promise<void> => {
  const { db, signedTransaction, transaction } = params;
  const { account } = await getAccountAndCoin(
    db,
    cantonCoinList,
    transaction.accountId,
  );

  await broadcastTransactionToBlockchain(
    hexToBase64(signedTransaction),
    hexToBase64(account.extraData?.publicKey ?? ''),
    transaction.computedData.preparedTransaction,
  );
};
