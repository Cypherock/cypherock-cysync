import { IBaseRepository } from "./BaseRepository";
import { IPriceHistory } from "./PriceHistory";

export interface IPriceInfo {
	id: string;
	currency: string;
	latestPrice: boolean;
}

export interface IPriceInfoRepository extends IBaseRepository<IPriceInfo> {
	getPriceHistory(IPriceInfo): Promise<IPriceHistory>;
}
