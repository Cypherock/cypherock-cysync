import { ICoinAllocation } from '@cypherock/coin-support-interfaces';
import { getDefaultUnit, getParsedAmount } from '@cypherock/coin-support-utils';
import { BigNumber } from '@cypherock/cysync-utils';
import { IAccount, IDatabase, IPriceInfo } from '@cypherock/db-interfaces';

export interface IAccountAllocation extends ICoinAllocation {
  percentage: number;
  account: IAccount;
}

export const getAccountAllocations = async (params: {
  db: IDatabase;
  accounts: IAccount[];
  priceInfos: IPriceInfo[];
}) => {
  const { accounts, priceInfos } = params;
  const allocations: IAccountAllocation[] = [];

  for (const account of accounts) {
    const priceInfo = priceInfos.find(p => p.assetId === account.assetId);
    const latestPrice = priceInfo?.latestPrice ?? '0';
    const { amount } = getParsedAmount({
      coinId: account.parentAssetId,
      assetId: account.assetId,
      amount: account.balance,
      unitAbbr: getDefaultUnit(account.parentAssetId, account.assetId).abbr,
    });

    const value = new BigNumber(amount).multipliedBy(latestPrice).toString();

    allocations.push({
      account,
      assetId: account.assetId,
      parentAssetId: account.parentAssetId,
      balance: account.balance,
      value,
      percentage: 0,
      price: latestPrice,
    });
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
    allocation.percentage = percentage;
  }

  return allocations;
};
