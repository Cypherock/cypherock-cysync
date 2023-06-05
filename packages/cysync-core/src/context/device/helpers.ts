import { ConnectDevice } from '@cypherock/cysync-interfaces';
import {
  IGetDeviceInfoResultResponse,
  ManagerApp,
} from '@cypherock/sdk-app-manager';
import {
  DeviceState,
  IDevice,
  IDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { uint8ArrayToHex } from '@cypherock/sdk-utils';
import {
  DeviceConnectionStatus,
  IDeviceConnectionInfo,
  IDeviceConnectionRetry,
  IParseDeviceAction,
} from './types';

export const DEVICE_LISTENER_INTERVAL = 1000;
export const MAX_CONNECTION_RETRY = 3;

export const checkIfSameDevice = (a: IDevice, b: IDevice) =>
  a.path === b.path &&
  a.serial === b.serial &&
  a.type === b.type &&
  a.vendorId === b.vendorId &&
  a.productId === b.productId;

export const checkIfDeviceInList = (list: IDevice[], device: IDevice) =>
  list.findIndex(e => checkIfSameDevice(e, device)) !== -1;

export const getDeviceState = (
  device: IDevice,
  info?: IGetDeviceInfoResultResponse,
) => {
  let { deviceState } = device;

  if (info && info.isInitial) {
    deviceState = DeviceState.INITIAL;
  }

  return {
    deviceState,
    isMain: deviceState === DeviceState.MAIN,
    isInitial: deviceState === DeviceState.INITIAL,
    isBootloader: deviceState === DeviceState.BOOTLOADER,
  };
};

export const createDeviceConnectionInfo = (
  device: IDevice,
  state: DeviceConnectionStatus,
  info?: IGetDeviceInfoResultResponse,
): IDeviceConnectionInfo => ({
  device,
  status: state,
  firmwareVersion: info?.firmwareVersion
    ? `${info.firmwareVersion.major}.${info.firmwareVersion.minor}.${info.firmwareVersion.patch}`
    : undefined,
  serial: info?.deviceSerial ? uint8ArrayToHex(info.deviceSerial) : undefined,
  ...getDeviceState(device, info),
});

export const parseNewDevices = (
  devices: IDevice[],
  connectionInfo?: IDeviceConnectionInfo,
  connectionRetry?: IDeviceConnectionRetry,
) => {
  const actions: IParseDeviceAction[] = [];

  if (devices.length <= 0) {
    if (connectionInfo || connectionRetry) {
      actions.push({ type: 'disconnected' });
    }
  } else {
    const isNewDeviceConnected = !connectionInfo;
    const isSameDeviceStillConnected =
      connectionInfo && checkIfDeviceInList(devices, connectionInfo.device);

    // Connected device is removed
    if (connectionInfo && !isSameDeviceStillConnected) {
      actions.push({ type: 'disconnected' });
    }

    if (isNewDeviceConnected || !isSameDeviceStillConnected) {
      actions.push({ type: 'try-connection', device: devices[0] });
    }
  }

  return actions;
};

export const tryEstablishingDeviceConnection = async (
  connectDevice: ConnectDevice,
  device: IDevice,
): Promise<IGetDeviceInfoResultResponse | undefined> => {
  let connection: IDeviceConnection | undefined;

  try {
    let info: IGetDeviceInfoResultResponse | undefined;

    if (device.deviceState !== DeviceState.BOOTLOADER) {
      connection = await connectDevice(device);
      const app = await ManagerApp.create(connection);
      info = await app.getDeviceInfo();
      connection.destroy();
    }

    return info;
  } catch (error) {
    connection?.destroy();
    throw error;
  }
};

export interface IDeviceConnectionErrorAction {
  type: 'error' | 'retry';
  state?: DeviceConnectionStatus;
  updatedRetry?: IDeviceConnectionRetry;
}

export const parseDeviceConnectionError = (
  device: IDevice,
  _error?: any,
  connectionRetry?: IDeviceConnectionRetry,
) => {
  let action: IDeviceConnectionErrorAction;

  if ((connectionRetry?.retries ?? 0) >= MAX_CONNECTION_RETRY) {
    action = { type: 'error', state: DeviceConnectionStatus.UNKNOWN_ERROR };
  } else {
    const isSameDeviceRetry = connectionRetry
      ? checkIfSameDevice(connectionRetry.device, device)
      : false;

    const updatedRetry: IDeviceConnectionRetry = {
      device,
      retries: isSameDeviceRetry ? (connectionRetry?.retries ?? 0) + 1 : 1,
    };
    action = { type: 'retry', updatedRetry };
  }

  return action;
};
