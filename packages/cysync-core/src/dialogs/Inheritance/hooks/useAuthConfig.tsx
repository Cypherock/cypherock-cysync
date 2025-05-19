import { assert } from '@cypherock/cysync-utils';
import { useMemo } from 'react';

import {
  IWalletAuthTokens,
  selectInheritanceSeedAuthTokens,
  selectInheritanceWalletAuthTokens,
  updateSeedAuthTokens,
  updateWalletAuthTokens,
  useAppSelector,
} from '~/store';

export type AuthTokenType = 'SEED' | 'WALLET';

const updateAuthTokens = {
  SEED: updateSeedAuthTokens,
  WALLET: updateWalletAuthTokens,
} as const;

export const useAuthTokenConfig = (props: {
  walletId: string;
  authType: AuthTokenType;
}) => {
  const walletAuthTokens = useAppSelector(selectInheritanceWalletAuthTokens);
  const seedAuthTokens = useAppSelector(selectInheritanceSeedAuthTokens);

  const authTokens = useMemo(() => {
    if (props.authType === 'SEED') return seedAuthTokens;
    if (props.authType === 'WALLET') return walletAuthTokens;
    return undefined;
  }, [props.authType]);

  const authTokenConfig = useMemo(() => {
    const accessToken = authTokens?.[props.walletId]?.accessToken;
    const refreshToken = authTokens?.[props.walletId]?.refreshToken;

    assert(accessToken, 'accessToken not found');
    assert(refreshToken, 'refreshToken not found');

    const updateAuthToken = (token: string) => {
      const authToken: IWalletAuthTokens = {
        accessToken: token,
        refreshToken,
      };

      updateAuthTokens[props.authType]({
        walletId: props.walletId,
        authTokens: authToken,
      });
    };

    return {
      accessToken,
      refreshTokenConfig: {
        refreshToken,
        updateAuthToken,
      },
    };
  }, [props]);

  return {
    authTokenConfig,
  };
};
