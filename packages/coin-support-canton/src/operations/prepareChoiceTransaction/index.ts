import { getAccountAndCoin } from '@cypherock/coin-support-utils';
import { cantonCoinList } from '@cypherock/coins';
import { AccountTypeMap } from '@cypherock/db-interfaces';

import { IPrepareCantonChoiceTransactionParams } from './types';

import { ICantonInstrument, prepareChoiceTxn } from '../../services';
import { IPreparedCantonTransaction } from '../transaction';

export const prepareChoiceTransaction = async (
  params: IPrepareCantonChoiceTransactionParams,
): Promise<IPreparedCantonTransaction> => {
  const { db, txn, choice, keyDB } = params;
  const { account } = await getAccountAndCoin(
    db,
    cantonCoinList,
    txn.accountId,
  );

  if (!txn.extraData?.contractId) {
    throw new Error('Canton choice transaction requires contract id');
  }

  let instrument: ICantonInstrument;
  const isTokenAccount = account.type === AccountTypeMap.subAccount;
  if (isTokenAccount) {
    const tokenDetails =
      cantonCoinList[account.parentAssetId].tokens[account.assetId];
    instrument = tokenDetails.instrument;
  } else {
    instrument = cantonCoinList[account.assetId].instrument;
  }

  const preparedTransaction = await prepareChoiceTxn(
    choice,
    {
      partyId: account.xpubOrAddress,
      transferContractId: txn.extraData.contractId,
      instrument,
    },
    keyDB,
  );

  return {
    accountId: txn.accountId,
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
      fees: txn.fees,
      utxos: [],
    },
    computedData: {
      output: {
        address: txn.outputs?.[0].address,
        amount: txn.amount,
        memo: txn.extraData?.memo,
      },
      fees: '0',
      preparedTransaction,
      choice,
    },
  };
};
