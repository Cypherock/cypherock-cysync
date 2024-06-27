import { makePostRequest } from '@cypherock/cysync-utils';

import { config } from '../../config';
import {
  TronAccountResourcesApiResponse,
  TronAccountResourcesApiResponseSchema,
  TronAddressDetailsApiResponse,
  TronAddressDetailsApiResponseSchema,
} from '../validators';

const baseURL = `${config.API_CYPHEROCK}/tron/wallet`;

export const getAccountDetailsByAddress = async (
  address: string,
): Promise<TronAddressDetailsApiResponse> => {
  const url = `${baseURL}/address`;

  const response = await makePostRequest(url, { address });

  const result = TronAddressDetailsApiResponseSchema.safeParse(response.data);

  if (!result.success) throw new Error('Failed to fetch tron account details');

  return result.data;
};

export const getBalanceAndTransactionsCount = async (
  address: string,
): Promise<{ balance: string; txnCount: number }> => {
  const addressDetails = await getAccountDetailsByAddress(address);

  return {
    balance: addressDetails.data
      .reduce((acc, curr) => acc + curr.balance, 0)
      .toString(),
    txnCount: addressDetails.data.length,
  };
};

export const getAccountResourcesByAddress = async (
  address: string,
): Promise<TronAccountResourcesApiResponse> => {
  const url = `${baseURL}/resource`;

  const response = await makePostRequest(url, { address });

  const result = TronAccountResourcesApiResponseSchema.safeParse(response.data);

  if (!result.success)
    throw new Error('Failed to fetch tron account resources');

  return result.data;
};
