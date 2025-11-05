import axios, { AxiosError, AxiosRequestConfig, HttpStatusCode } from 'axios';
import Zod from 'zod';

import { sleep } from './sleep';

export interface MakeRequestOptions {
  maxTries?: number;
  waitInMSBetweenEachAPIRetry?: number;
}

export interface AuthTokenConfig {
  accessToken: string;
  refreshTokenConfig?: RefreshTokenConfig;
}

export interface RefreshTokenConfig {
  refreshToken: string;
  refreshTokenUrl: string;
  updateAccessToken: (newAccessToken: string) => Promise<void>;
}

export const makePostRequest = async (
  url: string,
  data?: Record<string, any>,
  options?: MakeRequestOptions,
  config?: AxiosRequestConfig,
) => {
  let tries = 0;
  let doRetry = false;
  let latestError: Error = new Error('Unknown error');

  const WAIT_TIME = options?.waitInMSBetweenEachAPIRetry ?? 2000;

  let nextWaitTime = WAIT_TIME;
  const maxTries = options?.maxTries ?? 3;

  do {
    try {
      if (tries > 0) {
        await sleep(nextWaitTime);
      }

      const response = await axios.post(url, data, config);

      if (
        response.data.message === 'NOTOK' &&
        response.data.result.toLowerCase().includes('max rate limit')
      ) {
        tries += 1;
        doRetry = true;
        latestError = new Error('Max rate limit reached for API');
        nextWaitTime = tries * WAIT_TIME;
      } else {
        return response;
      }
    } catch (e: any) {
      doRetry = false;
      if (
        e?.response?.status &&
        (e?.response?.status === 429 || e?.response?.status >= 500)
      ) {
        doRetry = true;
      }
      tries += 1;
      latestError = e;
    }
  } while (tries <= maxTries && doRetry);

  throw latestError;
};

export async function makePostRequestWithValidation<T>(
  schema: Zod.Schema<T>,
  url: string,
  data?: Record<string, any>,
  options?: MakeRequestOptions,
) {
  const response = await makePostRequest(url, data, options);
  const result = schema.parse(response.data);
  return result;
}

export const makePostRequestWithAuth = async (
  url: string,
  data?: Record<string, any>,
  authTokenConfig?: AuthTokenConfig,
  options?: MakeRequestOptions,
) => {
  let result;
  try {
    result = await makePostRequest(
      url,
      data,
      options,
      authTokenConfig?.accessToken
        ? {
            headers: {
              Authorization: `Bearer ${authTokenConfig?.accessToken}`,
            },
          }
        : undefined,
    );
  } catch (error) {
    const { refreshTokenConfig } = authTokenConfig ?? {};
    if (!refreshTokenConfig || !(error as any).isAxiosError) throw error;

    const axiosError = error as AxiosError;
    if (axiosError.response?.status !== HttpStatusCode.Unauthorized)
      throw error;

    let newAccessToken = '';
    const refreshTokenResponse = await makePostRequest(
      refreshTokenConfig.refreshTokenUrl,
      {
        refreshToken: refreshTokenConfig.refreshToken,
      },
    );

    newAccessToken = refreshTokenResponse.data.accessToken;
    if (!newAccessToken) throw error;

    await refreshTokenConfig.updateAccessToken(newAccessToken);
    result = await makePostRequest(url, data, options, {
      headers: {
        Authorization: `Bearer ${newAccessToken}`,
      },
    });
  }
  return result;
};
