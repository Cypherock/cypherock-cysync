import { ICoinAllocation } from '@cypherock/coin-support-interfaces';
import { BigNumber } from '@cypherock/cysync-utils';
import { IAccount } from '@cypherock/db-interfaces';

import { ICreateGetCoinAllocationsParams } from './types';

import { getCoinPrice } from '../db';
import { convertToUnit, getDefaultUnit, getZeroUnit } from '../unit';
import logger from '../utils/logger';

export * from './types';

export async function createGetCoinAllocations(
  params: ICreateGetCoinAllocationsParams,
) {
  const { db, walletId, getCoinIds, assetId, parentAssetId, currency } = params;

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

    const coinPrice = await getCoinPrice(db, coinId.assetId, currency);
    const allAccounts = await db.account.getAll(query);
    const accounts = allAccounts.filter(a => !a.isHidden);

    if (accounts.length > 0) {
      try {
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
      } catch (error) {
        logger.warn('Error in calculating portfolio allocation share', {
          error: (error as Error).message,
        });
      }
    }
  }

  return { allocations };
}
