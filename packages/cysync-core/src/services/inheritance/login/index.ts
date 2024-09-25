import {
  resendResultSchema,
  registerVerifyResultSchema,
  initResultSchema,
  validateResultSchema,
  registerResultSchema,
  InheritanceLoginEmailType,
  verifyResultSchema,
  refreshAccessTokenResultSchema,
  updateNomineesResultSchema,
  updateExecutorResultSchema,
} from './schema';

import { makePostRequest, runAndHandleServerErrors } from '../../utils';
import { inheritanceBaseUrl } from '../common';

export {
  type InheritanceLoginInitResponse,
  type InheritanceLoginResendResponse,
  type InheritanceLoginRegisterVerifyResponse,
  type InheritanceLoginConcern,
  type InheritanceLoginValidateResponse,
  type InheritanceLoginRegisterResponse,
  type InheritanceLoginEmailType,
  type InheritanceLoginVerifyResponse,
  type InheritanceLoginRefreshAccessTokenResponse,
  InheritanceLoginEmailTypeMap,
  InheritanceLoginConcernMap,
} from './schema';

const baseUrl = `${inheritanceBaseUrl}/wallet-account`;

export const InheritanceLoginTypeMap = {
  owner: 'OWNER',
  nominee: 'NOMINEE',
} as const;

export type InheritanceLoginType =
  (typeof InheritanceLoginTypeMap)[keyof typeof InheritanceLoginTypeMap];

export const InheritanceLoginAuthTypeMap = {
  full: 'FULL',
  seed: 'SEED',
  wallet: 'WALLET',
} as const;

export type InheritanceLoginAuthType =
  (typeof InheritanceLoginAuthTypeMap)[keyof typeof InheritanceLoginAuthTypeMap];

const init = async (params: {
  walletId: string;
  loginType: InheritanceLoginType;
  authType: InheritanceLoginAuthType;
}) =>
  runAndHandleServerErrors(() =>
    makePostRequest(initResultSchema, `${baseUrl}/init`, params),
  );

const validate = async (params: {
  requestId: string;
  seedPublicKey?: string;
  walletPublicKey?: string;
  seedSignature?: string;
  walletSignature?: string;
}) =>
  runAndHandleServerErrors(() =>
    makePostRequest(validateResultSchema, `${baseUrl}/validate`, params),
  );

const register = async (params: {
  name: string;
  requestId: string;
  email: string;
  alternateEmail: string;
}) =>
  runAndHandleServerErrors(() =>
    makePostRequest(registerResultSchema, `${baseUrl}/register/init`, params),
  );

const resendOTP = async (params: { requestId: string }) =>
  runAndHandleServerErrors(() =>
    makePostRequest(resendResultSchema, `${baseUrl}/otp/resend`, params),
  );

const registerVerify = async (params: {
  requestId: string;
  otp: string;
  emailType: InheritanceLoginEmailType;
}) =>
  runAndHandleServerErrors(() =>
    makePostRequest(registerVerifyResultSchema, `${baseUrl}/register/verify`, {
      requestId: params.requestId,
      secret: params.otp,
      emailType: params.emailType,
    }),
  );

const verify = async (params: { requestId: string; otp: string }) =>
  runAndHandleServerErrors(() =>
    makePostRequest(verifyResultSchema, `${baseUrl}/login`, {
      requestId: params.requestId,
      secret: params.otp,
    }),
  );

const refreshAccessToken = async (params: { refreshToken: string }) =>
  runAndHandleServerErrors(() =>
    makePostRequest(
      refreshAccessTokenResultSchema,
      `${baseUrl}/refresh-token`,
      params,
    ),
  );

const updateNominees = async (params: {
  nominees: { name: string; email: string }[];
  accessToken: string;
}) =>
  runAndHandleServerErrors(() =>
    makePostRequest(
      updateNomineesResultSchema,
      `${baseUrl}/info/nominee`,
      {
        nominee: params.nominees,
      },
      params.accessToken,
    ),
  );

const updateExecutor = async (params: {
  name: string;
  email: string;
  alternateEmail: string;
  nomineeEmail: string;
  accessToken: string;
}) =>
  runAndHandleServerErrors(() =>
    makePostRequest(
      updateExecutorResultSchema,
      `${baseUrl}/info/nominee`,
      {
        name: params.name,
        email: params.email,
        alternateEmail: params.alternateEmail,
        nominee: [params.nomineeEmail],
      },
      params.accessToken,
    ),
  );

export const inheritanceLoginService = {
  init,
  resendOTP,
  verify,
  registerVerify,
  validate,
  register,
  refreshAccessToken,
  updateNominees,
  updateExecutor,
};
