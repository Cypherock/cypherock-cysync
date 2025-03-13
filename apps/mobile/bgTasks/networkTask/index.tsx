import React, { useEffect } from 'react';
import { useNetworkState } from 'expo-network';
import { setNetworkState, useAppDispatch } from '@/store';

export const NetworkPingTask: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isConnected, isInternetReachable } = useNetworkState();

  useEffect(() => {
    if (isConnected && isInternetReachable) {
      dispatch(setNetworkState(isConnected && isInternetReachable));
    } else {
      dispatch(setNetworkState(false));
    }
  }, [isConnected, isInternetReachable]);

  return null;
};
