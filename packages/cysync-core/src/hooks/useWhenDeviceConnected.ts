import { useEffect } from 'react';
import { ConnectDevice } from '@cypherock/cysync-interfaces';
import {
  DeviceConnectionStatus,
  IDeviceConnectionInfo,
} from '../context/device/helpers';
import { useDevice } from '../context';
import { useNavigateTo } from './useNavigateTo';
import { routes } from '../config';

export type OnConnectCallback = (params: {
  connection?: IDeviceConnectionInfo;
  connectDevice: ConnectDevice;
}) => void;

export const useWhenDeviceConnected = (onConnect?: OnConnectCallback) => {
  const { connection, connectDevice } = useDevice();
  const navigateTo = useNavigateTo();
  useEffect(() => {
    if (connection && connection.status === DeviceConnectionStatus.CONNECTED) {
      if (onConnect) onConnect({ connection, connectDevice });
    } else {
      navigateTo(routes.onboarding.deviceDetection.path);
    }
  }, [connection]);

  return { connection, connectDevice };
};
