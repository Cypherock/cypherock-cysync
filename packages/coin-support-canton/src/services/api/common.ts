import {
  AuthTokenConfig,
  makePostRequestWithAuth,
} from '@cypherock/cysync-utils';
import { IKeyValueStore } from '@cypherock/db-interfaces';

import { config } from '../../config';

interface ICantonAuthTokens {
  accessToken: string;
  refreshToken: string;
}

const cantonAuthTokensKey = 'cantonAuthTokens';

/** In-memory cache so refreshed token is used by subsequent calls in same session when storage (e.g. AsyncStorage) doesn't persist in time. */
const accessTokenCache = new Map<string, string>();

const cantonAuthTokensStore = {
  get: async (keyDB: IKeyValueStore) =>
    JSON.parse(
      (await keyDB.getItem(cantonAuthTokensKey)) ?? '{}',
    ) as ICantonAuthTokens,
  set: async (keyDB: IKeyValueStore, cantonAuthTokens: ICantonAuthTokens) =>
    keyDB.setItem(cantonAuthTokensKey, JSON.stringify(cantonAuthTokens)),
  remove: async (keyDB: IKeyValueStore) =>
    keyDB.removeItem(cantonAuthTokensKey),
};

export const getAuthTokenConfig = async (
  keyDB?: IKeyValueStore,
): Promise<AuthTokenConfig | undefined> => {
  if (!keyDB) return undefined;
  const cantonAuthTokens = await cantonAuthTokensStore.get(keyDB);
  if (!cantonAuthTokens?.accessToken || !cantonAuthTokens?.refreshToken)
    return undefined;

  const { refreshToken } = cantonAuthTokens;
  let cachedAccessToken = accessTokenCache.get(refreshToken);
  if (
    cachedAccessToken &&
    cantonAuthTokens.accessToken &&
    cachedAccessToken !== cantonAuthTokens.accessToken
  ) {
    accessTokenCache.delete(refreshToken);
    cachedAccessToken = undefined;
  }
  const accessToken = cachedAccessToken ?? cantonAuthTokens.accessToken;

  return {
    accessToken,
    refreshTokenConfig: {
      refreshToken,
      updateAccessToken: async (newAccessToken: string) => {
        accessTokenCache.set(refreshToken, newAccessToken);
        await cantonAuthTokensStore.set(keyDB, {
          accessToken: newAccessToken,
          refreshToken,
        });
      },
      refreshTokenUrl: `${config.API_CYPHEROCK}/canton/user/refresh-token`,
      clearTokens: async () => {
        accessTokenCache.delete(refreshToken);
        await cantonAuthTokensStore.remove(keyDB);
      },
    },
  };
};

export const makePostRequestWithAuthTokenConfig = async (
  url: string,
  data: Record<string, any>,
  keyDB?: IKeyValueStore,
): Promise<any> =>
  makePostRequestWithAuth(url, data, await getAuthTokenConfig(keyDB));
