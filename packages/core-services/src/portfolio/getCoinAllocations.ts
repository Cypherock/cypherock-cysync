import { getCoinSupport } from '@cypherock/coin-support';
import { ICoinAllocation } from '@cypherock/coin-support-interfaces';
import { coinFamiliesMap } from '@cypherock/coins';
import { BigNumber } from '@cypherock/cysync-utils';
import { IDatabase } from '@cypherock/db-interfaces';

export interface ICoinAllocationWithPercentage extends ICoinAllocation {
  percentage: number;
}

export const getCoinAllocations = async (params: {
  db: IDatabase;
  walletId?: string;
  assetId?: string;
  parentAssetId?: string;
}) => {
  const coinFamiliesList = Object.keys(coinFamiliesMap);

  const allocations: ICoinAllocation[] = [];
  const allocationsWithPercentage: ICoinAllocationWithPercentage[] = [];

  for (const coinFamily of coinFamiliesList) {
    const coinSupport = getCoinSupport(coinFamily);
    const result = await coinSupport.getCoinAllocations({ ...params });
    allocations.push(...result.allocations);
  }

  const total = allocations.reduce((t, a) => t.plus(a.value), new BigNumber(0));

  for (const allocation of allocations) {
    let percentage = 0;

    if (!total.isNaN() && total.toNumber() !== 0) {
      percentage = new BigNumber(allocation.value)
        .dividedBy(total)
        .multipliedBy(100)
        .toNumber();
    }

    allocationsWithPercentage.push({
      ...allocation,
      percentage,
    });
  }

  return allocationsWithPercentage;
};
