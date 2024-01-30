import {
  ConnectDevice,
  GetDevices,
  AddUsbChangeListener,
  RemoveUsbChangeListener,
} from '@cypherock/cysync-interfaces';
import { createLoggerWithPrefix } from '@cypherock/cysync-utils';
import { OnboardingStep } from '@cypherock/sdk-app-manager';
import { IDevice, IDeviceConnection } from '@cypherock/sdk-interfaces';
import lodash from 'lodash';
import PropTypes from 'prop-types';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { keyValueStore } from '~/utils';

import {
  createDeviceConnectionInfo,
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
  reconnectDevice: () => void;
  deviceHandlingState: DeviceHandlingState;
  getDeviceHandlingState: () => DeviceHandlingState;
}

export const DeviceContext: React.Context<DeviceContextInterface> =
  React.createContext<DeviceContextInterface>({} as DeviceContextInterface);

export interface DeviceProviderProps {
  children?: React.ReactNode;
  getDevices: GetDevices;
  connectDevice: ConnectDevice;
  addUsbChangeListener: AddUsbChangeListener;
  removeUsbChangeListener: RemoveUsbChangeListener;
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
  addUsbChangeListener,
  removeUsbChangeListener,
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
    if (!(await keyValueStore.isOnboardingCompleted.get())) return;

    setDeviceHandlingState(getDeviceHandlingState());
  };

  useEffect(() => {
    onConnectionChange();
  }, [connectionInfo]);

  const getDeviceHandlingState = () => {
    if (!connectionInfo) {
      return DeviceHandlingState.NOT_CONNECTED;
    }
    if (connectionInfo.status === DeviceConnectionStatus.BUSY) {
      return DeviceHandlingState.BUSY;
    }
    if (connectionInfo.status === DeviceConnectionStatus.INCOMPATIBLE) {
      return DeviceHandlingState.INCOMPATIBLE;
    }
    if (
      connectionInfo.status === DeviceConnectionStatus.CONNECTED &&
      connectionInfo.isBootloader
    ) {
      return DeviceHandlingState.BOOTLOADER;
    }
    if (
      connectionInfo.status === DeviceConnectionStatus.CONNECTED &&
      (connectionInfo.onboardingStep !==
        OnboardingStep.ONBOARDING_STEP_COMPLETE ||
        connectionInfo.isInitial)
    ) {
      return DeviceHandlingState.NOT_ONBOARDED;
    }
    if (
      connectionInfo.status === DeviceConnectionStatus.CONNECTED &&
      connectionInfo.isMain &&
      !connectionInfo.isAuthenticated
    ) {
      return DeviceHandlingState.NOT_AUTHENTICATED;
    }
    if (connectionInfo.status === DeviceConnectionStatus.CONNECTED) {
      return DeviceHandlingState.USABLE;
    }
    return DeviceHandlingState.UNKNOWN_ERROR;
  };

  const markDeviceAsConnected = (
    device: IDevice,
    connection: IDeviceConnection,
    status: DeviceConnectionStatus,
    info?: IConnectedDeviceInfo,
  ) => {
    const deviceConnectionInfo = createDeviceConnectionInfo(
      device,
      status,
      connection,
      info,
    );
    setConnectionInfo(deviceConnectionInfo);

    logger.info('Device connected successfully', {
      ...deviceConnectionInfo,
      connection: undefined,
    });
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

      if (action.updatedRetry) {
        connectionRetryRef.current = {
          ...action.updatedRetry,
          retryTimeout: setTimeout(deviceListenerDebounce, 1000),
        };
      }
    }
  };

  const deviceListener = async () => {
    const devices = await getDevices();

    const actions = parseNewDevices(
      devices,
      connectionInfoRef.current,
      connectionRetryRef.current,
    );

    for (const action of actions) {
      if (action.type === 'disconnected') {
        logger.info('Connected device was removed');
        markDeviceAsNotConnected();
      } else if (action.type === 'try-connection' && action.device) {
        tryToConnect(action.device);
      }
    }
  };

  const tryToConnect = async (device: IDevice) => {
    try {
      logger.info('Trying to establish device connection', { device });
      const { info, status, connection } =
        await tryEstablishingDeviceConnection(connectDevice, device);
      markDeviceAsConnected(device, connection, status, info);
    } catch (error) {
      logger.warn('Error connecting device', { device, error });
      markDeviceAsConnectionError(device, error);
    }
  };

  const deviceListenerDebounce = useCallback(
    lodash.debounce(deviceListener, 500),
    [],
  );

  const reconnectDevice = () => {
    markDeviceAsNotConnected();
    deviceListenerDebounce();
  };

  useEffect(() => {
    deviceListener();

    addUsbChangeListener(deviceListenerDebounce);

    return () => {
      removeUsbChangeListener();

      if (connectionRetryRef.current?.retryTimeout) {
        clearTimeout(connectionRetryRef.current.retryTimeout);
      }
    };
  }, []);

  const ctx = useMemo(
    () => ({
      connection: connectionInfo,
      connectDevice,
      getDevices,
      reconnectDevice,
      deviceHandlingState,
      getDeviceHandlingState,
    }),
    [
      connectionInfo,
      connectDevice,
      getDevices,
      reconnectDevice,
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
