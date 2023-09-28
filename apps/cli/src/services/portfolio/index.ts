import { getDefaultUnit, getParsedAmount } from '@cypherock/coin-support-utils';
import { coinList } from '@cypherock/coins';
import { getCoinAllocations } from '@cypherock/cysync-core-services';
import { BigNumber } from '@cypherock/cysync-utils';
import { IDatabase } from '@cypherock/db-interfaces';

export const showPortfolio = async (db: IDatabase) => {
  const allocations = await getCoinAllocations({ db });

  const displayTable = allocations
    .sort((a, b) => b.percentage - a.percentage)
    .map(a => {
      const { amount, unit } = getParsedAmount({
        coinId: a.parentAssetId,
        assetId: a.assetId,
        unitAbbr: getDefaultUnit(a.assetId).abbr,
        amount: a.balance,
      });

      return {
        name: coinList[a.assetId].name,
        balance: `${amount} ${unit.abbr}`,
        value: `${new BigNumber(a.value).toFixed(2)} USD`,
        percentage: `${a.percentage.toFixed(2)}%`,
      };
    });

  console.table(displayTable);
};
