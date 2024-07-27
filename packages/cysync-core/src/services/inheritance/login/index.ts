import axios from 'axios';

import { config } from '~/config';

import {
  resendResultSchema,
  verifyResultSchema,
  InheritanceLoginResendResponse,
  InheritanceLoginVerifyResponse,
} from './schema';

import { runAndHandleServerErrors } from '../../utils';

export {
  type InheritanceLoginResendResponse,
  type InheritanceLoginVerifyResponse,
} from './schema';

const resendOTP = async (params: { requestId: string }) =>
  runAndHandleServerErrors<InheritanceLoginResendResponse>(async () => {
    const response = await axios.post(`${config.API_CYPHEROCK}/login/resend`, {
      ...params,
    });

    const result = resendResultSchema.parse(response.data);

    return result;
  });

const verify = async (params: { requestId: string; otp: string }) =>
  runAndHandleServerErrors<InheritanceLoginVerifyResponse>(async () => {
    const response = await axios.post(`${config.API_CYPHEROCK}/logn/verify`, {
      ...params,
    });

    const result = verifyResultSchema.parse(response.data);

    return result;
  });

export const inheritanceLoginService = {
  resendOTP,
  verify,
};
