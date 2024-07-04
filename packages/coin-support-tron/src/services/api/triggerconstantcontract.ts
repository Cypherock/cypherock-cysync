import { makePostRequest } from '@cypherock/cysync-utils';

import { config } from '../../config';
import logger from '../../utils/logger';
import {
  TronTriggerConstantContractCallApiResponse,
  TronTriggerConstantContractCallWithErrorApiResponseSchema,
} from '../validators';

const baseURL = `${config.API_CYPHEROCK}/tron/wallet`;

export interface ITriggerConstantContractCallParams {
  contract_address: string;
  function_selector: string;
  parameter: string;
  owner_address: string;
}

export const triggerConstantContractCall = async (
  params: ITriggerConstantContractCallParams,
): Promise<TronTriggerConstantContractCallApiResponse> => {
  const url = `${baseURL}/triggerconstantcontract`;

  const response = await makePostRequest(url, params);

  const parseResult =
    TronTriggerConstantContractCallWithErrorApiResponseSchema.safeParse(
      response.data,
    );

  if (!parseResult.success)
    throw new Error('Failed to trigger constant contract call');

  if ('code' in parseResult.data.result) {
    const errorMessage = `triggerconstantcontract call failed: ${parseResult.data.result.code}`;
    logger.error(errorMessage, parseResult.data.result);
    throw new Error(errorMessage);
  }

  return parseResult.data as TronTriggerConstantContractCallApiResponse;
};
