import { IBuySellOrder } from '@cypherock/db-interfaces';

export interface IBuySellOrderState {
  isLoaded: boolean;
  orders: IBuySellOrder[];
}
