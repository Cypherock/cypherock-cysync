import { IInitializeTransactionParams } from '@cypherock/coin-support-interfaces';
import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { cantonCoinList } from '@cypherock/coins';
import { BigNumber } from '@cypherock/cysync-utils';
import { AccountTypeMap } from '@cypherock/db-interfaces';

import { getUtxos, ICantonInstrument } from '../../services';
import { IPreparedCantonTransaction } from '../transaction';

export const initializeTransaction = async (
  params: IInitializeTransactionParams,
): Promise<IPreparedCantonTransaction> => {
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

  const utxos = await getUtxos(account.xpubOrAddress, instrument, keyDB);
  const sortedUtxos = [...utxos].sort((a, b) => {
    const diff = new BigNumber(b.interfaceViewValue.amount).minus(
      a.interfaceViewValue.amount,
    );
    // eslint-disable-next-line no-nested-ternary
    return diff.isZero() ? 0 : diff.isPositive() ? 1 : -1;
  });

  return {
    accountId,
    validation: {
      outputs: [],
      hasEnoughBalance: true,
      isValidFee: true,
      isFeeBelowMin: false,
      ownOutputAddressNotAllowed: [],
      zeroAmountNotAllowed: false,
      isInvalidExpiry: false,
    },
    userInputs: {
      outputs: [],
      isSendAll: false,
    },
    staticData: {
      fees: '0',
      sortedUtxos,
    },
    computedData: {
      output: { address: '', amount: '0' },
      fees: '0',
    },
  };
};
