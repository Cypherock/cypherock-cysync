import { makePostRequest } from '@cypherock/cysync-utils';

import { config } from '../../config';
import {
  TronTokensDetailApiResponse,
  TronTokensDetailApiResponseSchema,
} from '../validators';

const baseURL = `${config.API_CYPHEROCK}/tron/tokens`;

export const getTokensDetailByAddress = async (
  address: string,
): Promise<Required<TronTokensDetailApiResponse>> => {
  const url = `${baseURL}/balance`;

  const response = await makePostRequest(url, { address });

  const result = TronTokensDetailApiResponseSchema.safeParse(response.data);

  if (!result.success) throw new Error('Failed to fetch tron account details');

  return result.data;
};
