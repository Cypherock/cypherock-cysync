import axios from 'axios';

import { config } from '../config';

export const getQuotes = async (params: {
  fromCurrency: string;
  toCurrency: string;
  amount: string;
  fromNetwork: string;
  toNetwork: string;
}) => {
  return await axios.post(`${config.API_CYPHEROCK}/swap/get-quotes`, {
    ...params,
  });
};

export const createExchange = async (params: {
  id: string;
  providerId: string;
  fromCurrency: string;
  toCurrency: string;
  amount: string;
  receiverAddress: string;
  receiverAddressSignature: string;
  fromNetwork: string;
  toNetwork: string;
  deviceSerial: string;
}) => {
  return await axios.post(`${config.API_CYPHEROCK}/swap/create-exchange`, {
    ...params,
  });
};
