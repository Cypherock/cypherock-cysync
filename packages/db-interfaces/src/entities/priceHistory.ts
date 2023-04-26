import type { IBaseEntity, IBaseRepository } from './base';

export interface IPriceSnapshot {
  timestamp: number;
  price: string;
}

export interface IPriceHistory extends IBaseEntity {
  days: number;
  history: IPriceSnapshot[];
  // foreign keys
  priceInfoId: string;
  assetId: string;
  currency: string;
}

export type IPriceHistoryRepository = IBaseRepository<IPriceHistory>;
