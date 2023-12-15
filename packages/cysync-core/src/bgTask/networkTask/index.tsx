import React, { useEffect } from 'react';

import logger from '~/utils/logger';

import { setNetworkState, useAppDispatch } from '../..';

/**
 * ***************************** WARNING *****************************
 * To be only used via `Context`. Only 1 instance of useNetwokStatus
 * should be active in the whole application.
 */
export const NetworkPingTask: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleConnectionChange = () => {
    logger.info('Checking for internet connection');
    const condition = navigator.onLine ? 'online' : 'offline';

    if (condition === 'online') {
      dispatch(setNetworkState(true));
    } else {
      dispatch(setNetworkState(false));
    }
  };

  useEffect(() => {
    handleConnectionChange();

    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);

    return () => {
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
    };
  }, []);

  return null;
};
