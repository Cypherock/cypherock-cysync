import { ICoinAllocation } from '@cypherock/coin-support-interfaces';
import { BigNumber } from '@cypherock/cysync-utils';
import { IAccount } from '@cypherock/db-interfaces';

import { ICreateGetCoinAllocationsParams } from './types';

import { getCoinPrice } from '../db';
import { convertToUnit, getDefaultUnit, getZeroUnit } from '../unit';

export * from './types';

export async function createGetCoinAllocations(
  params: ICreateGetCoinAllocationsParams,
) {
  const { db, walletId, getCoinIds } = params;

  const allocations: ICoinAllocation[] = [];

  const coinIdList = await getCoinIds(params);

  for (const coinId of coinIdList) {
    const query: Partial<IAccount> = { assetId: coinId };
    if (walletId) {
      query.walletId = walletId;
    }

    const coinPrice = await getCoinPrice(db, coinId);
    const accounts = await db.account.getAll(query);

    if (accounts.length > 0) {
      const balance = accounts
        .reduce((a, b) => a.plus(b.balance), new BigNumber(0))
        .toString();
      const balanceInDefaultUnit = convertToUnit({
        amount: balance,
        fromUnitAbbr: getZeroUnit(coinId).abbr,
        coinId,
        toUnitAbbr: getDefaultUnit(coinId).abbr,
      });
      const value = new BigNumber(balanceInDefaultUnit.amount)
        .multipliedBy(coinPrice)
        .toString();

      allocations.push({ assetId: coinId, balance, value });
    }
  }

  return { allocations };
}
