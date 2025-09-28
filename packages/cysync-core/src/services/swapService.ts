import { SupportedProviders } from '@cypherock/db-interfaces';
import axios from 'axios';

import { config } from '../config';

const SUPPORTED_PROVIDERS = Object.values(SupportedProviders) as string[];

export const getQuotes = async (params: {
  fromCurrency: string;
  toCurrency: string;
  amount: string;
  fromNetwork: string;
  toNetwork: string;
}) =>
  axios.post(`${config.API_CYPHEROCK}/swap/get-quotes`, {
    supportedProviders: SUPPORTED_PROVIDERS,
    ...params,
  });

export const createExchange = async (params: {
  id: string;
  providerId: string;
  fromCurrency: string;
  toCurrency: string;
  amount: string;
  refundAddress?: string;
  receiverAddress: string;
  receiverAddressSignature: string;
  fromNetwork: string;
  toNetwork: string;
  deviceSerial: string;
  index: number;
}) =>
  axios.post(`${config.API_CYPHEROCK}/swap/create-exchange`, {
    ...params,
  });

export const getExchangeStatus = async (params: {
  providerId: string;
  exchangeId: string;
}) =>
  axios.post(`${config.API_CYPHEROCK}/swap/get-exchange-status`, {
    ...params,
  });

export const getProviderDetails = async () =>
  axios.post(`${config.API_CYPHEROCK}/swap/get-providers-details`, {
    providers: SUPPORTED_PROVIDERS,
  });
