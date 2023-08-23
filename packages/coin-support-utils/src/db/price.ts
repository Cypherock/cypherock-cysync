import { BtcIdMap } from '@cypherock/coins';
import { IDatabase } from '@cypherock/db-interfaces';

const mockPriceData: Partial<Record<string, string>> = {
  [BtcIdMap.bitcoin]: '26032.82',
  [BtcIdMap.litecoin]: '65.08',
  [BtcIdMap.dash]: '26.78',
  [BtcIdMap.dogecoin]: '0.06',
};

export const getCoinPrice = async (
  db: IDatabase,
  assetId: string,
  currency = 'usd',
) => {
  // TODO: Remove mock data
  const mockData = mockPriceData[assetId];
  if (mockData) return mockData;

  const res = await db.priceInfo.getOne({ assetId, currency });

  if (!res) return '0';

  return res.latestPrice;
};
