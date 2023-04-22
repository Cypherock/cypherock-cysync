import type { IBaseRepository } from './BaseRepository';
import type { IPriceHistory } from './PriceHistory';

export interface IPriceInfo {
  id: string;
  currency: string;
  latestPrice: boolean;
}

export interface IPriceInfoRepository extends IBaseRepository<IPriceInfo> {
  getPriceHistory(priceInfo: IPriceInfo): Promise<IPriceHistory>;
}
