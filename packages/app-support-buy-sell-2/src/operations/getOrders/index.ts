import { makePostRequest } from '@cypherock/cysync-utils';

import { IGetOrdersParams, IGetOrdersResponse } from './types';

import { config } from '../../config';

export * from './types';

const BASE_URL = `${config.API_CYPHEROCK}/buySell`;

export const getOrders = async (
  params: IGetOrdersParams,
): Promise<IGetOrdersResponse> => {
  try {
    const response = await makePostRequest(`${BASE_URL}/get-orders`, params);
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: JSON.stringify(error),
    };
  }
};
