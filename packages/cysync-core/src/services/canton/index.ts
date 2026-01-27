import { cantonBaseUrl } from './common';
import {
  loginOtpVerificationResultSchema,
  loginResultSchema,
  refreshAccessTokenResultSchema,
} from './schema';

import { makePostRequest, runAndHandleServerErrors } from '../utils';

const login = async (params: { email: string }) =>
  runAndHandleServerErrors(() =>
    makePostRequest(loginResultSchema, `${cantonBaseUrl}/user/login`, params),
  );

const loginOtpVerification = async (params: {
  email: string;
  secret: string;
}) =>
  runAndHandleServerErrors(() =>
    makePostRequest(
      loginOtpVerificationResultSchema,
      `${cantonBaseUrl}/user/verify`,
      params,
    ),
  );

const refreshAccessToken = async (params: { refreshToken: string }) =>
  runAndHandleServerErrors(() =>
    makePostRequest(
      refreshAccessTokenResultSchema,
      `${cantonBaseUrl}/user/refresh-token`,
      params,
    ),
  );

export const cantonService = {
  login,
  loginOtpVerification,
  refreshAccessToken,
};
