import type { IBaseRepository } from './baseRepository';
import type { IPriceHistory } from './priceHistory';

export interface IPriceInfo {
  id: string;
  currency: string;
  latestPrice: string;
}

export interface IPriceInfoRepository extends IBaseRepository<IPriceInfo> {
  getPriceHistory(priceInfo: IPriceInfo): Promise<IPriceHistory>;
}
