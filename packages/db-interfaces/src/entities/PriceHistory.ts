import type { IBaseRepository } from './BaseRepository';
import type { IPriceInfo } from './PriceInfo';

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
  getPriceInfo(IPriceHistory): Promise<IPriceInfo>;
}
