import React, { useEffect } from 'react';
import { useNetworkState } from 'expo-network';
import { setNetworkState, useAppDispatch } from '@/store';

export const NetworkPingTask: React.FC = () => {
  const dispatch = useAppDispatch();
  const networkState = useNetworkState();

  useEffect(() => {
    dispatch(setNetworkState(networkState.isConnected ?? false));
  }, [networkState]);

  return null;
};
