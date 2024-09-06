import { config } from '~/config';

import { initResultSchema, verifyResultSchema } from './schema';

import { makePostRequest, runAndHandleServerErrors } from '../../../utils';

export {
  type InheritanceSyncPlansVerifyResponse,
  type InheritanceSyncPlansInitResponse,
} from './schema';

const baseUrl = `${config.API_CYPHEROCK}/wallet-account/sync`;

const init = async (params: { email: string }) =>
  runAndHandleServerErrors(() =>
    makePostRequest(initResultSchema, `${baseUrl}/init`, params),
  );

const verify = async (params: { requestId: string; otp: string }) =>
  runAndHandleServerErrors(() =>
    makePostRequest(verifyResultSchema, `${baseUrl}/verify`, {
      requestId: params.requestId,
      secret: params.otp,
    }),
  );

export const inheritanceSyncPlansService = {
  init,
  verify,
};
