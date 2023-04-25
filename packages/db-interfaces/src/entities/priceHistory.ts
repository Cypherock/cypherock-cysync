import type { IBaseRepository } from './baseRepository';
import type { IPriceInfo } from './priceInfo';

export interface IPriceSnapshot {
  timestamp: number;
  price: string;
}

export interface IPriceHistory {
  id: string;
  days: number;
  history: IPriceSnapshot[];
}

export interface IPriceHistoryRepository
  extends IBaseRepository<IPriceHistory> {
  getPriceInfo(priceHistory: IPriceHistory): Promise<IPriceInfo>;
}
