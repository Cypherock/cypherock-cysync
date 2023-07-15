import { IPriceInfo } from '@cypherock/db-interfaces';

export interface IPriceInfoState {
  isLoaded: boolean;
  priceInfos: IPriceInfo[];
}
