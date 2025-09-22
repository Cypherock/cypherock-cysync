import { makePostRequest } from '@cypherock/cysync-utils';

import { ICreateOrderParams, ICreateOrderResponse } from './types';

export * from './types';

const BASE_URL = `http://localhost:5000/buySell`;

export const createOrder = async (
  params: ICreateOrderParams,
): Promise<ICreateOrderResponse> => {
  try {
    const response = await makePostRequest(`${BASE_URL}/order`, params);
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: JSON.stringify(error),
    };
  }
};
