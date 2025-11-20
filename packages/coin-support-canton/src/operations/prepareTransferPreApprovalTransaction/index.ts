import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { cantonCoinList } from '@cypherock/coins';
import { AccountTypeMap } from '@cypherock/db-interfaces';

import {
  IPrepareCantonTransferPreApprovalTransactionParams,
  IPreparedCantonTransferPreApprovalTransaction,
} from './types';

import {
  ICantonInstrument,
  prepareTransferPreApprovalTxn,
} from '../../services';

export const prepareTransferPreApprovalTransaction = async (
  params: IPrepareCantonTransferPreApprovalTransactionParams,
): Promise<IPreparedCantonTransferPreApprovalTransaction> => {
  const { accountId, db, keyDB } = params;
  const { account } = await getAccountAndCoin(db, cantonCoinList, accountId);

  let instrument: ICantonInstrument;
  const isTokenAccount = account.type === AccountTypeMap.subAccount;
  if (isTokenAccount) {
    const tokenDetails =
      cantonCoinList[account.parentAssetId].tokens[account.assetId];
    instrument = tokenDetails.instrument;
  } else {
    instrument = cantonCoinList[account.assetId].instrument;
  }

  const preparedTransaction = await prepareTransferPreApprovalTxn(
    account.xpubOrAddress,
    instrument,
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
