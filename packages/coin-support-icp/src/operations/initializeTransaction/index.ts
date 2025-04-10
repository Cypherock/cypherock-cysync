import { IInitializeTransactionParams } from '@cypherock/coin-support-interfaces';
import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { icpCoinList } from '@cypherock/coins';
import { AccountTypeMap } from '@cypherock/db-interfaces';

import { getTokenTransactionFee, getTransactionFee } from '../../services';
import { getIngressExpiry, getNonce } from '../../utils';
import { IPreparedIcpTransaction } from '../transaction';

export const initializeTransaction = async (
  params: IInitializeTransactionParams,
): Promise<IPreparedIcpTransaction> => {
  const { accountId, db } = params;
  const { account } = await getAccountAndCoin(db, icpCoinList, accountId);

  let fees = '0';

  const isTokenAccount = account.type === AccountTypeMap.subAccount;
  if (isTokenAccount) {
    const tokenDetails =
      icpCoinList[account.parentAssetId].tokens[account.assetId];

    fees = await getTokenTransactionFee(tokenDetails.canisters.ledger);
  } else {
    fees = await getTransactionFee();
  }

  return {
    accountId,
    validation: {
      outputs: [],
      hasEnoughBalance: true,
      isValidFee: true,
      ownOutputAddressNotAllowed: [],
      zeroAmountNotAllowed: false,
      isInvalidMemo: false,
    },
    userInputs: {
      outputs: [],
      isSendAll: false,
    },
    staticData: {
      fees,
    },
    computedData: {
      output: { address: '', amount: '0' },
      fees,
      ingressExpiry: getIngressExpiry(),
      nonce: getNonce(),
    },
  };
};
