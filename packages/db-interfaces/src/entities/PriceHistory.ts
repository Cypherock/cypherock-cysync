import { IBaseRepository } from "./BaseRepository";
import { IPriceInfo } from "./PriceInfo";

export interface PriceSnapshot {
	timestamp: number;
	price: string;
}

export interface IPriceHistory {
	id: string;
	days: number;
	history: PriceSnapshot[];
}

export interface IPriceHistoryRepository
	extends IBaseRepository<IPriceHistory> {
	getPriceInfo(IPriceHistory): Promise<IPriceInfo>;
}
