import { ServerError, ServerErrorType } from '@cypherock/cysync-core-constants';
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  HttpStatusCode,
} from 'axios';

import { createServerErrorFromError } from '~/utils';

import { inheritanceBaseUrl } from '../inheritance';
import { refreshAccessTokenResultSchema } from '../inheritance/login/schema';

export const serverErrorCodeMap: Record<number, ServerErrorType | undefined> = {
  1001: ServerErrorType.OTP_VERIFICATION_FAILED,
  1003: ServerErrorType.LOGIN_FAILED,
  1004: ServerErrorType.SIGNATURE_VERIFICATION_FAILED,
  1005: ServerErrorType.INVALID_REQUEST,
  1006: ServerErrorType.UNAUTHORIZED_ACCESS,
  1007: ServerErrorType.RESOURCE_NOT_FOUND,
  1008: ServerErrorType.INTERNAL_SERVER_ERROR,
  1009: ServerErrorType.REQUEST_TIMEOUT,
  1010: ServerErrorType.OTP_EXPIRED,
  1011: ServerErrorType.PAYLOAD_VALIDATION_ERROR,
  1012: ServerErrorType.MAX_RETRIES_EXCEEDED,
  1013: ServerErrorType.ACCOUNT_LOCKED,
  1014: ServerErrorType.SERVICE_UNAVAILABLE,
  1015: ServerErrorType.REQUEST_CONFLICT,
  1016: ServerErrorType.VALIDATION_ERROR,
  1017: ServerErrorType.MISSING_WALLET,
  1018: ServerErrorType.MISSING_USER,
  1019: ServerErrorType.MISSING_NOMINEE,
  1020: ServerErrorType.MISSING_EXECUTOR,
  1021: ServerErrorType.MISSING_SESSION,
  1022: ServerErrorType.INVALID_COUPON,
  1023: ServerErrorType.INVALID_SESSION,
  1024: ServerErrorType.INVALID_DEVICE,
  1025: ServerErrorType.INVALID_PRIVATE_KEY,
  1026: ServerErrorType.ACTIVE_PLAN_FOUND,
};

export type Only<T, U> = {
  [P in keyof T]: T[P];
} & {
  [P in keyof U]?: never;
};

export type Either<T, U> = Only<T, U> | Only<U, T>;

export interface ServerErrorResponse {
  error: ServerError;
}

export interface ServerResultResponse<T> {
  result: T;
}

export type ServerResponseWithError<T> = Either<
  ServerErrorResponse,
  ServerResultResponse<T>
>;

export async function runAndHandleServerErrors<T>(
  callback: () => Promise<T>,
): Promise<ServerResponseWithError<T>> {
  try {
    const result = await callback();
    return {
      result,
    };
  } catch (error) {
    if ((error as any)?.isAxiosError) {
      const e = error as AxiosError;

      if ((e.response?.data as any).code) {
        const { code } = e.response?.data as any;
        const errorType =
          serverErrorCodeMap[code] ?? ServerErrorType.UNKNOWN_ERROR;
        const serverError =
          createServerErrorFromError(e, errorType) ??
          new ServerError(ServerErrorType.UNKNOWN_ERROR);

        return {
          error: serverError as ServerError,
        };
      }
    }

    throw error;
  }
}

export interface RefreshTokenConfig {
  refreshToken: string;
  updateAuthToken: (newAuthToken: string) => void;
}

export interface AuthTokenConfig {
  accessToken: string;
  refreshTokenConfig?: RefreshTokenConfig;
}

export async function makePostRequest<T>(
  schema: Zod.Schema<T>,
  url: string,
  data: any,
  authTokenConfig?: AuthTokenConfig,
  axiosConfig?: AxiosRequestConfig,
) {
  return autoRefreshTokenRequest(
    (accessToken: string) =>
      makeRequest(
        {
          schema,
          accessToken,
          config: axiosConfig,
          data,
        },
        ({ config, data: postData }) => axios.post(url, postData, config),
      ),
    authTokenConfig,
    axiosConfig,
  );
}

// TODO: Maybe localise this function for inheritance scope? and make refresh-token API injectable?
export async function autoRefreshTokenRequest<T>(
  requestFunction: (accessToken: string) => Promise<T>,
  authTokenConfig?: AuthTokenConfig,
  axiosConfig?: AxiosRequestConfig,
) {
  let result;
  try {
    result = await requestFunction(authTokenConfig?.accessToken ?? '');
  } catch (error) {
    const { refreshTokenConfig } = authTokenConfig ?? {};
    if (!refreshTokenConfig || !(error as any).isAxiosError) throw error;

    const axiosError = error as AxiosError;
    if (axiosError.response?.status !== HttpStatusCode.Unauthorized)
      throw error;

    let newAuthToken = '';
    // won't recurse because we are not providing authTokenConfig in this call
    const refreshTokenResponse = await makePostRequest(
      refreshAccessTokenResultSchema,
      `${inheritanceBaseUrl}/wallet-account/refresh-token`,
      {
        refreshToken: refreshTokenConfig.refreshToken,
      },
      undefined,
      axiosConfig,
    );

    newAuthToken = refreshTokenResponse.authToken;
    if (!newAuthToken) throw error;

    refreshTokenConfig.updateAuthToken(newAuthToken);
    result = await requestFunction(newAuthToken ?? '');
  }
  return result;
}

export async function makeGetRequest<T>(
  schema: Zod.Schema<T>,
  url: string,
  authTokenConfig?: AuthTokenConfig,
  axiosConfig?: AxiosRequestConfig,
) {
  return autoRefreshTokenRequest(
    (accessToken: string) =>
      makeRequest(
        {
          schema,
          accessToken,
          config: axiosConfig,
        },
        ({ config }) => axios.get(url, config),
      ),
    authTokenConfig,
    axiosConfig,
  );
}

export type RequestFunction = (params: {
  config?: AxiosRequestConfig;
  data?: any;
}) => Promise<AxiosResponse>;

async function makeRequest<T>(
  params: {
    schema: Zod.Schema<T>;
    accessToken?: string;
    config?: AxiosRequestConfig;
    data?: any;
  },
  requestFunction: RequestFunction,
) {
  const { schema, accessToken, data } = params;
  let { config } = params;

  if (accessToken) {
    config = {
      ...(config ?? {}),
      headers: {
        ...config?.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    };
  }

  const response = await requestFunction({ config, data });
  const result = schema.parse(response.data);
  return result;
}
