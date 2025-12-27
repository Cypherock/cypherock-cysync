import {
  getAccountAndCoin,
  updateAccount,
} from '@cypherock/coin-support-utils';
import { cantonCoinList } from '@cypherock/coins';
import { hexToBase64 } from '@cypherock/sdk-utils';

import { IBroadcastCantonTransferPreApprovalTransactionParams } from './types';

import { broadcastTransactionToBlockchain } from '../../services';

export const broadcastTransferPreApprovalTransaction = async (
  params: IBroadcastCantonTransferPreApprovalTransactionParams,
): Promise<void> => {
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

  await updateAccount(db, account.__id, {
    extraData: { ...account.extraData, isTransferPreApprovalEnabled: true },
  });
};
