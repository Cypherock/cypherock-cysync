import { makePostRequest } from '@cypherock/cysync-utils';
import { OnRampSupportedProviders } from '@cypherock/db-interfaces';

import { IGetOffersParams, IGetOffersResponse } from './types';

import { config } from '../../config';

export * from './types';

const BASE_URL = `${config.API_CYPHEROCK}/buySell`;

const SUPPORTED_PROVIDERS = Object.values(OnRampSupportedProviders) as string[];

export const getOffers = async (
  params: IGetOffersParams,
): Promise<IGetOffersResponse> => {
  try {
    const data = params;

    if (!data.supportedProviders) {
      data.supportedProviders = SUPPORTED_PROVIDERS;
    }

    const response = await makePostRequest(`${BASE_URL}/offers`, data);
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: JSON.stringify(error),
    };
  }
};
