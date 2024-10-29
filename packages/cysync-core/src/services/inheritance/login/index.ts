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
  ReminderPeriod,
  updateReminderResultSchema,
  NomineeType,
  clearMeataDataResultSchema,
} from './schema';

import {
  AuthTokenConfig,
  makePostRequest,
  runAndHandleServerErrors,
} from '../../utils';
import { inheritanceBaseUrl, InheritanceUserType } from '../common';

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

export const InheritanceLoginAuthTypeMap = {
  full: 'FULL',
  seed: 'SEED',
  wallet: 'WALLET',
} as const;

export type InheritanceLoginAuthType =
  (typeof InheritanceLoginAuthTypeMap)[keyof typeof InheritanceLoginAuthTypeMap];

const init = async (params: {
  walletId: string;
  loginType: InheritanceUserType;
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
  walletName?: string;
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
  nominee?: { name: string; email: string; alternateEmail?: string };
  requestId?: string;
  secret?: string;
  verify?: boolean;
  nomineeType?: NomineeType;
  authTokenConfig: AuthTokenConfig;
}) =>
  runAndHandleServerErrors(() =>
    makePostRequest(
      updateNomineesResultSchema,
      `${baseUrl}/info/nominee`,
      {
        nominee: params.nominee,
        secret: params.secret,
        verify: params.verify,
        requestId: params.requestId,
        nomineeType: params.nomineeType,
      },
      params.authTokenConfig,
    ),
  );

const updateExecutor = async (params: {
  name: string;
  email: string;
  alternateEmail: string;
  nomineeEmail: string;
  executorMessage?: string;
  authTokenConfig: AuthTokenConfig;
}) =>
  runAndHandleServerErrors(() =>
    makePostRequest(
      updateExecutorResultSchema,
      `${baseUrl}/info/executor`,
      {
        name: params.name,
        email: params.email,
        alternateEmail: params.alternateEmail,
        nominee: [params.nomineeEmail],
        executorMessage: params.executorMessage,
      },
      params.authTokenConfig,
    ),
  );

const updateReminder = async (params: {
  frequency: ReminderPeriod;
  authTokenConfig: AuthTokenConfig;
}) =>
  runAndHandleServerErrors(() =>
    makePostRequest(
      updateReminderResultSchema,
      `${baseUrl}/info/reminder`,
      { frequency: params.frequency },
      params.authTokenConfig,
    ),
  );

const clearMetaData = async (params: {
  resetExecutor?: boolean;
  resetNominee?: boolean;
  authTokenConfig: AuthTokenConfig;
}) =>
  runAndHandleServerErrors(() =>
    makePostRequest(
      clearMeataDataResultSchema,
      `${baseUrl}/info/clear`,
      {
        executor: params.resetExecutor === true,
        nominee: params.resetNominee === true,
      },
      params.authTokenConfig,
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
  updateReminder,
  clearMetaData,
};
