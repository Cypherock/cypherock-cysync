import { config } from '~/config';

import { createResultSchema } from './schema';

import { makePostRequest, runAndHandleServerErrors } from '../../utils';

export { type InheritancePlanCreateResponse } from './schema';

const baseUrl = `${config.API_CYPHEROCK}/wallet-account`;

const create = async (params: { encryptedData: string; accessToken: string }) =>
  runAndHandleServerErrors(() =>
    makePostRequest(
      createResultSchema,
      `${baseUrl}/info/message`,
      {
        encryptedData: params.encryptedData,
      },
      {
        headers: {
          Authorization: `Bearer ${params.accessToken}`,
        },
      },
    ),
  );

export const inheritancePlanService = {
  create,
};
