import { IPriceHistory } from '@cypherock/db-interfaces';

export interface IPriceHistoryState {
  isLoaded: boolean;
  priceHistories: IPriceHistory[];
}
