import { config } from '~/config';

import { createResultSchema } from './schema';

import { makePostRequest, runAndHandleServerErrors } from '../../utils';

export { type InheritancePlanCreateResponse } from './schema';

const baseUrl = `${config.API_CYPHEROCK}/wallet-recovery`;

const create = async (params: { secretMessage: string; accessToken: string }) =>
  runAndHandleServerErrors(() =>
    makePostRequest(createResultSchema, `${baseUrl}/create`, params, {
      headers: {
        Authorization: `Bearer ${params.accessToken}`,
      },
    }),
  );

export const inheritancePlanService = {
  create,
};
