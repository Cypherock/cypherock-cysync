import { IDatabase } from '@cypherock/db-interfaces';

export const getCoinPrice = async (
  db: IDatabase,
  assetId: string,
  currency = 'usd',
) => {
  const res = await db.priceInfo.getOne({ assetId, currency });

  if (!res) return '0';

  return res.latestPrice;
};
