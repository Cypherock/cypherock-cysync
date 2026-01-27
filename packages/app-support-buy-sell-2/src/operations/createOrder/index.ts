import { makePostRequest } from '@cypherock/cysync-utils';

import { ICreateOrderParams, ICreateOrderResponse } from './types';

import { config } from '../../config';

export * from './types';

const BASE_URL = `${config.API_CYPHEROCK}/buySell`;

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
