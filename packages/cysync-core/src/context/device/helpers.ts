import { ConnectDevice } from '@cypherock/cysync-interfaces';
import {
  IGetDeviceInfoResultResponse,
  IGetWalletsResultResponse,
  ManagerApp,
  OnboardingStep,
} from '@cypherock/sdk-app-manager';
import {
  DeviceAppErrorType,
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

export interface IConnectedDeviceInfo
  extends IGetDeviceInfoResultResponse,
    IGetWalletsResultResponse {}

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

  if (info?.isInitial) {
    deviceState = DeviceState.INITIAL;
  }

  return {
    deviceState,
    isMain: deviceState === DeviceState.MAIN,
    isInitial: deviceState === DeviceState.INITIAL,
    isBootloader: deviceState === DeviceState.BOOTLOADER,
    onboardingStep: info?.onboardingStep ?? OnboardingStep.UNRECOGNIZED,
  };
};

export const createDeviceConnectionInfo = (
  device: IDevice,
  state: DeviceConnectionStatus,
  connection?: IDeviceConnection,
  info?: IConnectedDeviceInfo,
): IDeviceConnectionInfo => ({
  device,
  connection,
  status: state,
  firmwareVersion: info?.firmwareVersion
    ? `${info.firmwareVersion.major}.${info.firmwareVersion.minor}.${info.firmwareVersion.patch}`
    : undefined,
  serial: info?.deviceSerial ? uint8ArrayToHex(info.deviceSerial) : undefined,
  walletList: info?.walletList,
  isAuthenticated: info?.isAuthenticated,
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
) => {
  let info: IConnectedDeviceInfo | undefined;
  let status = DeviceConnectionStatus.CONNECTED;

  const connection = await connectDevice(device);

  if (device.deviceState !== DeviceState.BOOTLOADER) {
    const app = await ManagerApp.create(connection);

    if (!(await app.isSupported())) {
      status = DeviceConnectionStatus.INCOMPATIBLE;
    } else {
      info = { ...(await app.getDeviceInfo()), walletList: [] };

      if (device.deviceState !== DeviceState.INITIAL && info.isAuthenticated) {
        const { walletList } = await app.getWallets();
        info.walletList = walletList;
      }
    }
  }

  return { info, status, connection };
};

export interface IDeviceConnectionErrorAction {
  type: 'error' | 'retry';
  state?: DeviceConnectionStatus;
  updatedRetry?: IDeviceConnectionRetry;
}

export const parseDeviceConnectionError = (
  device: IDevice,
  error?: any,
  connectionRetry?: IDeviceConnectionRetry,
) => {
  let action: IDeviceConnectionErrorAction;

  if (error?.code === DeviceAppErrorType.EXECUTING_OTHER_COMMAND) {
    action = { type: 'error', state: DeviceConnectionStatus.BUSY };
  } else if ((connectionRetry?.retries ?? 0) >= MAX_CONNECTION_RETRY) {
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
