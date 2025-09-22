export interface ICreateOrderParams {
  provider: string;
  receiverAddress: string;
  fromCurrency: string;
  toCurrency: string;
  network: string;
  amount: string;
  country?: string;
  state?: string;
  paymentMethod: string;
  extra: Record<string, string>;
}

export interface ICreateOrderResult {
  id: string;
  redirectUrl: string;
}

export interface ICreateOrderResponse {
  success: boolean;
  data?: ICreateOrderResult;
  error?: string;
}
