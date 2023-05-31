import { ConnectDevice, GetDevices } from '@cypherock/cysync-interfaces';
import { IDevice } from '@cypherock/sdk-interfaces';
import { IGetDeviceInfoResultResponse } from '@cypherock/sdk-app-manager';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef } from 'react';

import { createLoggerWithPrefix } from '../../utils/logger';
import { useStateWithRef } from '../../hooks';
import {
  createDeviceConnectionInfo,
  DEVICE_LISTENER_INTERVAL,
  parseDeviceConnectionError,
  parseNewDevices,
  tryEstablishingDeviceConnection,
} from './helpers';
import {
  DeviceConnectionStatus,
  IDeviceConnectionInfo,
  IDeviceConnectionRetry,
} from './types';

export * from './types';

const logger = createLoggerWithPrefix('DeviceConnection');

export interface DeviceContextInterface {
  connection?: IDeviceConnectionInfo;
  connectDevice: ConnectDevice;
}

export const DeviceContext: React.Context<DeviceContextInterface> =
  React.createContext<DeviceContextInterface>({} as DeviceContextInterface);

type Props = {
  children?: React.ReactNode;
  getDevices: GetDevices;
  connectDevice: ConnectDevice;
};

/**
 * ***************************** WARNING *****************************
 * To be only used via `useConnection`. Only 1 instance of DeviceProvider
 * should be active in the whole application.
 */
export const DeviceProvider: React.FC<Props> = ({
  children,
  getDevices,
  connectDevice,
}) => {
  const [connectionInfo, setConnectionInfo, connectionInfoRef] =
    useStateWithRef<IDeviceConnectionInfo | undefined>(undefined);
  const connectionRetryRef = useRef<IDeviceConnectionRetry | undefined>(
    undefined,
  );

  const listenerTimeout = useRef<any>();

  const markDeviceAsConnected = (
    device: IDevice,
    info?: IGetDeviceInfoResultResponse,
  ) => {
    const deviceConnectionInfo = createDeviceConnectionInfo(
      device,
      DeviceConnectionStatus.CONNECTED,
      info,
    );
    setConnectionInfo(deviceConnectionInfo);

    logger.info('Device connected successfully', deviceConnectionInfo);
    connectionRetryRef.current = undefined;
  };

  const markDeviceAsNotConnected = () => {
    setConnectionInfo(undefined);
    connectionRetryRef.current = undefined;
  };

  const markDeviceAsConnectionError = (device: IDevice, error: any) => {
    const action = parseDeviceConnectionError(
      device,
      error,
      connectionRetryRef.current,
    );

    if (action.type === 'error') {
      logger.info('Max tries exceeded for device connection');
      setConnectionInfo(
        createDeviceConnectionInfo(
          device,
          action.state ?? DeviceConnectionStatus.UNKNOWN_ERROR,
        ),
      );
    } else if (action.type === 'retry') {
      logger.info('Will retry device connection in next iteration');
      connectionRetryRef.current = action.updatedRetry;
    }
  };

  const deviceListener = async () => {
    const devices = await getDevices();

    const actions = parseNewDevices(
      devices,
      connectionInfoRef.current,
      connectionRetryRef.current,
    );

    let isConnecting = false;
    for (const action of actions) {
      if (action.type === 'disconnected') {
        logger.info('Connected device was removed');
        markDeviceAsNotConnected();
      } else if (action.type === 'try-connection' && action.device) {
        tryToConnect(action.device);
        isConnecting = true;
      }
    }

    if (!isConnecting) {
      restartDeviceListener();
    }
  };

  const tryToConnect = async (device: IDevice) => {
    try {
      logger.info('Trying to establish device connection', { device });
      const info = await tryEstablishingDeviceConnection(connectDevice, device);
      markDeviceAsConnected(device, info);
    } catch (error) {
      logger.warn('Error connecting device', { device, error });
      markDeviceAsConnectionError(device, error);
    } finally {
      restartDeviceListener();
    }
  };

  const restartDeviceListener = () => {
    clearTimeout(listenerTimeout.current);
    listenerTimeout.current = setTimeout(
      deviceListener,
      DEVICE_LISTENER_INTERVAL,
    );
  };

  useEffect(() => {
    restartDeviceListener();

    return () => {
      clearTimeout(listenerTimeout.current);
    };
  }, []);

  const ctx = useMemo(
    () => ({ connection: connectionInfo, connectDevice }),
    [connectionInfo, connectDevice],
  );

  return (
    <DeviceContext.Provider value={ctx}>{children}</DeviceContext.Provider>
  );
};

DeviceProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useDevice(): DeviceContextInterface {
  return React.useContext(DeviceContext);
}
