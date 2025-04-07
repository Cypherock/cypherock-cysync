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
