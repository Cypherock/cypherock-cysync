import { BinanceGetOrderDetailsResponse } from '../../services';

export interface IGetOrderDetailsParams {
  orderId: string;
  language?: string;
}

export type IGetOrderDetailsResult = BinanceGetOrderDetailsResponse['data'];
