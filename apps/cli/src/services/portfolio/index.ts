import {
  getAsset,
  getDefaultUnit,
  getParsedAmount,
} from '@cypherock/coin-support-utils';
import { coinFamiliesMap } from '@cypherock/coins';
import { getCoinAllocations } from '@cypherock/cysync-core-services';
import { BigNumber } from '@cypherock/cysync-utils';
import { IDatabase } from '@cypherock/db-interfaces';

export const showPortfolio = async (db: IDatabase, currency: string) => {
  const allocations = await getCoinAllocations({
    db,
    currency,
    coinFamilies: Object.keys(coinFamiliesMap),
  });

  const displayTable = allocations
    .sort((a, b) => b.percentage - a.percentage)
    .map(a => {
      const { amount, unit } = getParsedAmount({
        coinId: a.parentAssetId,
        assetId: a.assetId,
        unitAbbr: getDefaultUnit(a.parentAssetId, a.assetId).abbr,
        amount: a.balance,
      });

      const asset = getAsset(a.parentAssetId, a.assetId);

      return {
        name: asset?.name,
        balance: `${amount} ${unit.abbr}`,
        value: `${new BigNumber(a.value).toFixed(2)}`,
        percentage: `${a.percentage.toFixed(2)}%`,
      };
    });

  console.table(displayTable);
};
