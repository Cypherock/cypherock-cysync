import type { IEntity, IRepository } from './base';

export interface IPriceSnapshot {
  timestamp: number;
  price: string;
}

export interface IPriceHistory extends IEntity {
  days: number;
  history: IPriceSnapshot[];
  // foreign keys
  assetId: string;
  currency: string;
}

export type IPriceHistoryRepository = IRepository<IPriceHistory>;
