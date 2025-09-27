import { makePostRequest } from '@cypherock/cysync-utils';

import { IGetOffersParams, IGetOffersResponse } from './types';

import { config } from '../../config';

export * from './types';

const BASE_URL = `${config.API_CYPHEROCK}/buySell`;

export const getOffers = async (
  params: IGetOffersParams,
): Promise<IGetOffersResponse> => {
  try {
    const response = await makePostRequest(`${BASE_URL}/offers`, params);
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: JSON.stringify(error),
    };
  }
};
