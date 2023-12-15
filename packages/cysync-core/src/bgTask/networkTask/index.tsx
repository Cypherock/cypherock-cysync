import React, { useEffect } from 'react';

import logger from '~/utils/logger';

import { setNetworkState, useAppDispatch } from '../..';

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
