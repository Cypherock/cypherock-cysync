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

  return {
    accessToken: cantonAuthTokens.accessToken,
    refreshTokenConfig: {
      refreshToken: cantonAuthTokens.refreshToken,
      updateAccessToken: async (newAccessToken: string) => {
        await cantonAuthTokensStore.set(keyDB, {
          accessToken: newAccessToken,
          refreshToken: cantonAuthTokens.refreshToken,
        });
      },
      refreshTokenUrl: `${config.API_CYPHEROCK}/canton/user/refresh-token`,
      clearTokens: async () => {
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
