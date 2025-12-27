import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { cantonCoinList } from '@cypherock/coins';
import { ITransaction } from '@cypherock/db-interfaces';
import { hexToBase64 } from '@cypherock/sdk-utils';

import { IBroadcastCantonTransactionParams } from './types';

import { broadcastTransactionToBlockchain } from '../../services';

export const broadcastTransaction = async (
  params: IBroadcastCantonTransactionParams,
): Promise<ITransaction | undefined> => {
  const { db, signedTransaction, transaction, keyDB } = params;
  const { account } = await getAccountAndCoin(
    db,
    cantonCoinList,
    transaction.accountId,
  );

  await broadcastTransactionToBlockchain(
    {
      partyId: account.xpubOrAddress,
      signature: hexToBase64(signedTransaction),
      publicKey: hexToBase64(account.extraData?.publicKey ?? ''),
      preparedTransaction: transaction.computedData.preparedTransaction,
    },
    keyDB,
  );

  return undefined;
};
