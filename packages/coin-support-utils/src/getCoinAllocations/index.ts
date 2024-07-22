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
  const { db, walletId, getCoinIds, assetId, parentAssetId } = params;

  const allocations: ICoinAllocation[] = [];

  const coinIdList = await getCoinIds(db);

  for (const coinId of coinIdList) {
    if (assetId && coinId.assetId !== assetId) {
      continue;
    }

    if (parentAssetId && coinId.parentAssetId !== parentAssetId) {
      continue;
    }

    const query: Partial<IAccount> = { assetId: coinId.assetId };
    if (walletId) {
      query.walletId = walletId;
    }

    const coinPrice = await getCoinPrice(db, coinId.assetId);
    const accounts = await db.account.getAll(query);

    if (accounts.length > 0) {
      const balance = accounts
        .reduce((a, b) => a.plus(b.balance), new BigNumber(0))
        .toString();
      const balanceInDefaultUnit = convertToUnit({
        amount: balance,
        fromUnitAbbr: getZeroUnit(coinId.parentAssetId, coinId.assetId).abbr,
        coinId: coinId.parentAssetId,
        assetId: coinId.assetId,
        toUnitAbbr: getDefaultUnit(coinId.parentAssetId, coinId.assetId).abbr,
      });
      const value = new BigNumber(balanceInDefaultUnit.amount)
        .multipliedBy(coinPrice)
        .toString();

      allocations.push({
        assetId: coinId.assetId,
        parentAssetId: coinId.parentAssetId,
        balance,
        value,
        price: coinPrice,
      });
    }
  }

  return { allocations };
}
