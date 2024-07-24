import axios from 'axios';

import { config } from '~/config';

import {
  startResultSchema,
  resendResultSchema,
  verifyResultSchema,
  InheritanceSyncPlansStartResponse,
  InheritanceSyncPlansResendResponse,
  InheritanceSyncPlansVerifyResponse,
} from './schema';

import { runAndHandleServerErrors } from '../utils';

export {
  type InheritanceSyncPlansResendResponse,
  type InheritanceSyncPlansVerifyResponse,
  type InheritanceSyncPlansStartResponse,
} from './schema';

const start = async (params: { email: string }) =>
  runAndHandleServerErrors<InheritanceSyncPlansStartResponse>(async () => {
    const response = await axios.post(`${config.API_CYPHEROCK}/sync-plans`, {
      ...params,
    });

    const result = startResultSchema.parse(response.data);

    return result;
  });

const resendOTP = async (params: { requestId: string }) =>
  runAndHandleServerErrors<InheritanceSyncPlansResendResponse>(async () => {
    const response = await axios.post(
      `${config.API_CYPHEROCK}/sync-plans/resend`,
      {
        ...params,
      },
    );

    const result = resendResultSchema.parse(response.data);

    return result;
  });

const verify = async (params: { requestId: string; otp: string }) =>
  runAndHandleServerErrors<InheritanceSyncPlansVerifyResponse>(async () => {
    const response = await axios.post(
      `${config.API_CYPHEROCK}/sync-plans/verify`,
      {
        ...params,
      },
    );

    const result = verifyResultSchema.parse(response.data);

    return result;
  });

export const inheritanceSyncPlansService = {
  start,
  resendOTP,
  verify,
};
