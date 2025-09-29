import { IProviderDetails } from '../commonTypes';

export interface IGetOffersParams {
  fromCurrency: string;
  toCurrency: string;
  network: string;
  amount: string;
  country?: string;
  state?: string;
  supportedProviders?: string[];
}

export interface IPaymentMethod {
  code: string;
  name: string;
}

export interface IOfferDetails {
  id: string;
  provider: string;
  paymentMethod: IPaymentMethod;
  fee: string;
  fromAmount: string;
  toAmount: string;
  fromCurrency: string;
  toCurrency: string;
}

export interface IGetOffersResult {
  offers: IOfferDetails[];
  providers: IProviderDetails[];
}

export interface IGetOffersResponse {
  success: boolean;
  data?: IGetOffersResult;
  error?: string;
}
