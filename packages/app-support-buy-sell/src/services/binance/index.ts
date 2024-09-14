import { makePostRequestWithValidation } from '@cypherock/cysync-utils';

import {
  getCryptoNetworksResultSchema,
  getEstimatedQuoteResultSchema,
  getOrderDetailsResultSchema,
  getPaymentMethodListResultSchema,
  getTradingPairsResultSchema,
  IBinanceGetEstimatedQuoteParams,
  IBinanceGetOrderDetailsParams,
  IBinanceGetPaymentMethodListParams,
  IBinancePreorderParams,
  preorderResultSchema,
} from './schema';

import { config } from '../../config';

export {
  type BinanceGetTradingPairsResponse,
  type BinanceGetCryptoNetworksResponse,
  type BinanceGetEstimatedQuoteResponse,
  type BinanceGetPaymentMethodListResponse,
  type BinanceGetOrderDetailsResponse,
  type BinancePreorderResponse,
} from './schema';

const baseURL = `${config.API_CYPHEROCK}/v1/buy/binance`;

const getTradingPairs = async () => {
  const url = `${baseURL}/trading-pairs`;
  const response = await makePostRequestWithValidation(
    getTradingPairsResultSchema,
    url,
  );

  return response.data;
};

const getCryptoNetworks = async () => {
  const url = `${baseURL}/crypto-network`;
  const response = await makePostRequestWithValidation(
    getCryptoNetworksResultSchema,
    url,
  );
  return response.data;
};

const getEstimatedQuote = async (params: IBinanceGetEstimatedQuoteParams) => {
  const url = `${baseURL}/estimated-quote`;
  const response = await makePostRequestWithValidation(
    getEstimatedQuoteResultSchema,
    url,
    params,
  );
  return response.data;
};

const getPaymentMethodList = async (
  params: IBinanceGetPaymentMethodListParams,
) => {
  const url = `${baseURL}/payment-method-list`;
  const response = await makePostRequestWithValidation(
    getPaymentMethodListResultSchema,
    url,
    params,
  );
  return response.data;
};

const preorder = async (params: IBinancePreorderParams) => {
  const url = `${baseURL}/preorder`;
  const response = await makePostRequestWithValidation(
    preorderResultSchema,
    url,
    params,
  );
  return response.data;
};

const getOrderDetails = async (params: IBinanceGetOrderDetailsParams) => {
  const url = `${baseURL}/get-order`;
  const response = await makePostRequestWithValidation(
    getOrderDetailsResultSchema,
    url,
    params,
  );
  return response.data;
};

export const binanceService = {
  getTradingPairs,
  getCryptoNetworks,
  getEstimatedQuote,
  getPaymentMethodList,
  preorder,
  getOrderDetails,
};
