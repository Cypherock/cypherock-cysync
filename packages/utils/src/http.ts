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
  clearTokens?: () => Promise<void>;
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

const inflightRefreshes = new Map<string, Promise<string>>();

const refreshAccessToken = async (
  refreshTokenConfig: RefreshTokenConfig,
  originalError: unknown,
): Promise<string> => {
  const key = refreshTokenConfig.refreshToken;

  const existing = inflightRefreshes.get(key);
  if (existing) {
    return existing;
  }

  const promise = (async () => {
    const refreshTokenResponse = await makePostRequest(
      refreshTokenConfig.refreshTokenUrl,
      { refreshToken: refreshTokenConfig.refreshToken },
    );

    const newAccessToken = refreshTokenResponse.data.accessToken;
    if (!newAccessToken) throw originalError;

    await refreshTokenConfig.updateAccessToken(newAccessToken);
    return newAccessToken as string;
  })();

  inflightRefreshes.set(key, promise);

  try {
    return await promise;
  } finally {
    inflightRefreshes.delete(key);
  }
};

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
    const err = error as AxiosError;
    const status = err.response?.status;
    const is401 = status === HttpStatusCode.Unauthorized;

    if (!refreshTokenConfig) throw error;
    if (!is401) {
      throw error;
    }

    let newAccessToken = '';
    try {
      newAccessToken = await refreshAccessToken(refreshTokenConfig, error);
    } catch (refreshError) {
      const axiosRefreshError = refreshError as AxiosError;

      if (axiosRefreshError.response?.status === HttpStatusCode.Unauthorized) {
        if (refreshTokenConfig.clearTokens) {
          await refreshTokenConfig.clearTokens();
        }
      }
      throw error;
    }

    result = await makePostRequest(url, data, options, {
      headers: {
        Authorization: `Bearer ${newAccessToken}`,
      },
    });
  }
  return result;
};
