import { ConnectDevice, GetDevices } from '@cypherock/cysync-interfaces';
import { createLoggerWithPrefix } from '@cypherock/cysync-utils';
import { OnboardingStep } from '@cypherock/sdk-app-manager';
import { IDevice } from '@cypherock/sdk-interfaces';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { keyValueStore } from '~/utils';

import {
  createDeviceConnectionInfo,
  DEVICE_LISTENER_INTERVAL,
  IConnectedDeviceInfo,
  parseDeviceConnectionError,
  parseNewDevices,
  tryEstablishingDeviceConnection,
} from './helpers';
import {
  DeviceConnectionStatus,
  DeviceHandlingState,
  IDeviceConnectionInfo,
  IDeviceConnectionRetry,
} from './types';

import { useStateWithRef } from '../../hooks';
import baseLogger from '../../utils/logger';

export * from './types';
export * from './utils';

const logger = createLoggerWithPrefix(baseLogger, 'DeviceConnection');

export interface DeviceContextInterface {
  connection?: IDeviceConnectionInfo;
  connectDevice: ConnectDevice;
  getDevices: GetDevices;
  disconnectDevice: () => void;
  deviceHandlingState: DeviceHandlingState;
}

export const DeviceContext: React.Context<DeviceContextInterface> =
  React.createContext<DeviceContextInterface>({} as DeviceContextInterface);

export interface DeviceProviderProps {
  children?: React.ReactNode;
  getDevices: GetDevices;
  connectDevice: ConnectDevice;
}

/**
 * ***************************** WARNING *****************************
 * To be only used via `useConnection`. Only 1 instance of DeviceProvider
 * should be active in the whole application.
 */
export const DeviceProvider: React.FC<DeviceProviderProps> = ({
  children,
  getDevices,
  connectDevice,
}) => {
  const [connectionInfo, setConnectionInfo, connectionInfoRef] =
    useStateWithRef<IDeviceConnectionInfo | undefined>(undefined);
  const connectionRetryRef = useRef<IDeviceConnectionRetry | undefined>(
    undefined,
  );
  const [deviceHandlingState, setDeviceHandlingState] = useState(
    DeviceHandlingState.NOT_CONNECTED,
  );

  const onConnectionChange = async () => {
    setDeviceHandlingState(DeviceHandlingState.NOT_CONNECTED);
    // Only works if app has completed onboarding
    if (!connectionInfo || !(await keyValueStore.isOnboardingCompleted.get()))
      return;

    if (connectionInfo.status === DeviceConnectionStatus.BUSY) {
      setDeviceHandlingState(DeviceHandlingState.BUSY);
    } else if (connectionInfo.status === DeviceConnectionStatus.INCOMPATIBLE) {
      setDeviceHandlingState(DeviceHandlingState.INCOMPATIBLE);
    } else if (
      connectionInfo.status === DeviceConnectionStatus.CONNECTED &&
      connectionInfo.isBootloader
    ) {
      setDeviceHandlingState(DeviceHandlingState.BOOTLOADER);
    } else if (
      connectionInfo.status === DeviceConnectionStatus.CONNECTED &&
      (connectionInfo.onboardingStep !==
        OnboardingStep.ONBOARDING_STEP_COMPLETE ||
        connectionInfo.isInitial)
    ) {
      setDeviceHandlingState(DeviceHandlingState.NOT_ONBOARDED);
    } else if (
      connectionInfo.status === DeviceConnectionStatus.CONNECTED &&
      connectionInfo.isMain &&
      !connectionInfo.isAuthenticated
    ) {
      setDeviceHandlingState(DeviceHandlingState.NOT_AUTHENTICATED);
    } else if (connectionInfo.status === DeviceConnectionStatus.CONNECTED) {
      setDeviceHandlingState(DeviceHandlingState.USABLE);
    } else {
      setDeviceHandlingState(DeviceHandlingState.UNKNOWN_ERROR);
    }
  };

  useEffect(() => {
    onConnectionChange();
  }, [connectionInfo]);

  const listenerTimeout = useRef<any>();

  const markDeviceAsConnected = (
    device: IDevice,
    status: DeviceConnectionStatus,
    info?: IConnectedDeviceInfo,
  ) => {
    const deviceConnectionInfo = createDeviceConnectionInfo(
      device,
      status,
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
      const { info, status } = await tryEstablishingDeviceConnection(
        connectDevice,
        device,
      );
      markDeviceAsConnected(device, status, info);
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

  const disconnectDevice = () => {
    markDeviceAsNotConnected();
  };

  useEffect(() => {
    restartDeviceListener();

    return () => {
      clearTimeout(listenerTimeout.current);
    };
  }, []);

  const ctx = useMemo(
    () => ({
      connection: connectionInfo,
      connectDevice,
      getDevices,
      disconnectDevice,
      deviceHandlingState,
    }),
    [
      connectionInfo,
      connectDevice,
      getDevices,
      disconnectDevice,
      deviceHandlingState,
    ],
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
