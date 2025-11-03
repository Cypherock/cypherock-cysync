import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { cantonCoinList } from '@cypherock/coins';
import { hexToBase64 } from '@cypherock/sdk-utils';

import { IBroadcastCantonTransferPreApprovalTransactionParams } from './types';

import { broadcastTransactionToBlockchain } from '../../services';

export const broadcastTransferPreApprovalTransaction = async (
  params: IBroadcastCantonTransferPreApprovalTransactionParams,
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
    account.xpubOrAddress,
    transaction.computedData.preparedTransaction,
  );

  await db.account.update(
    { __id: account.__id },
    { extraData: { ...account.extraData, isTransferPreApprovalEnabled: true } },
  );
};
