import lodash from 'lodash';
import { useCallback } from 'react';

import { syncWalletsWithDevice } from '~/actions';

import { useStateToRef } from './useStateToRef';

import { useAppDispatch, useDevice } from '..';

export const useWalletSync = () => {
  const dispatch = useAppDispatch();
  const { connection } = useDevice();
  const deviceRef = useStateToRef({ connection });

  const doWalletSync = () => {
    dispatch(
      syncWalletsWithDevice({
        connection: deviceRef.current.connection,
        doFetchFromDevice: true,
      }),
    );
  };

  const debounceWalletSync = useCallback(
    lodash.debounce(doWalletSync, 500),
    [],
  );

  const onWalletSync = (e?: any) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }

    dispatch({ type: 'wallets/syncWithDevice/pending' });
    debounceWalletSync();
  };

  return {
    onWalletSync,
  };
};
