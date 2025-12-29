import { IBuySellStatus } from '@cypherock/db-interfaces';

export interface IOrderDetails {
  id: string;
  provider: string;
  status: IBuySellStatus;
  fromAmount: string;
  toAmount: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IGetOrderParams {
  id: string;
  provider: string;
}

export type IGetOrdersParams = IGetOrderParams[];

export type IGetOrdersResult = IOrderDetails[];

export interface IGetOrdersResponse {
  success: boolean;
  data?: IGetOrdersResult;
  error?: string;
}
