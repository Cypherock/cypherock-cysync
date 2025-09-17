import { GetDevices } from '@cypherock/cysync-interfaces';
import { FirmwareVariant, ManagerApp } from '@cypherock/sdk-app-manager';
import { DeviceConnection as DeviceConnectionHID } from '@cypherock/sdk-hw-hid';
import { DeviceConnection as DeviceConnectionSerialPort } from '@cypherock/sdk-hw-serialport';
import {
  DeviceConnectionError,
  DeviceConnectionErrorType,
  IDevice,
  IDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { WebContents } from 'electron';
import { usb } from 'usb';

import { ipcConfig } from './helpers/config';
import { callMethodOnObject, getMethodListFromObject } from './helpers/utils';

import * as deviceUtils from '../utils/device';

let firmwareWebContents: WebContents | undefined;

const getDevices: GetDevices = async () => {
  const hidDevices = await DeviceConnectionHID.list();

  const serialDevices = await DeviceConnectionSerialPort.list();

  return [...hidDevices, ...serialDevices];
};

const connectDevice = async (device: IDevice) => {
  const connectedDevice = await deviceUtils.connectDevice(device);

  return getMethodListFromObject(connectedDevice.connection, 1);
};

const connectedDeviceMethodCall = async (
  device: IDevice,
  method: string,
  ...args: any[]
) => {
  const connectedDevice = deviceUtils.getConnectedDevice();

  if (device.path !== connectedDevice?.device.path) {
    if (method === 'isConnected') return false;

    throw new DeviceConnectionError(DeviceConnectionErrorType.NOT_CONNECTED);
  }

  const res = await callMethodOnObject(
    connectedDevice.connection,
    method,
    ...args,
  );

  if (method === 'destroy') {
    deviceUtils.removeConnectedDevice();
  }

  return res;
};

const updateDeviceFirmware = async ({
  firmware,
  version,
  variant,
  allowPrerelease,
}: {
  firmware: Uint8Array;
  version: { major: number; minor: number; patch: number };
  variant: FirmwareVariant;
  allowPrerelease?: boolean;
}) => {
  const connected = deviceUtils.getConnectedDevice();

  if (!connected) {
    throw new DeviceConnectionError(DeviceConnectionErrorType.NOT_CONNECTED);
  }

  const { connection } = connected;

  const app = await ManagerApp.create(connection);

  await app.updateFirmware({
    firmware,
    version,
    variant,
    allowPrerelease,
    getDevices,
    createConnection: async (device: IDevice) =>
      (
        await deviceUtils.connectDevice(device)
      ).connection,
    onEvent: status => {
      firmwareWebContents?.send(
        ipcConfig.listeners.updateDeviceFirmwareStatus,
        status,
      );
    },
    onProgress: progress => {
      firmwareWebContents?.send(
        ipcConfig.listeners.updateDeviceFirmwareProgress,
        progress,
      );
    },
  });

  return true;
};

export const checkIfSameDevice = (a: IDevice, b: IDevice) =>
  a.path === b.path &&
  a.serial === b.serial &&
  a.type === b.type &&
  a.vendorId === b.vendorId &&
  a.productId === b.productId;

export const checkIfDeviceInList = (list: IDevice[], device: IDevice) =>
  list.findIndex(e => checkIfSameDevice(e, device)) !== -1;

const authenticateDevice = async (email?: string, cysyncVersion?: string) => {
  let connection: IDeviceConnection;

  const connected = deviceUtils.getConnectedDevice();

  const devices = await getDevices();

  if (devices.length <= 0) {
    throw new DeviceConnectionError(DeviceConnectionErrorType.NOT_CONNECTED);
  }

  // in certain cases, the existing connection is old (cached), hence checking and/or reconnecting
  if (connected) {
    const { device: existingDevice } = connected;

    if (checkIfDeviceInList(devices, existingDevice)) {
      connection = connected.connection;
    } else {
      const freshDevice = devices.find(
        device =>
          device.productId === existingDevice.productId &&
          device.serial === existingDevice.serial,
      );
      connection = (await deviceUtils.connectDevice(freshDevice ?? devices[0]))
        .connection;
    }
  } else {
    connection = (await deviceUtils.connectDevice(devices[0])).connection;
  }

  if (!connection) {
    throw new DeviceConnectionError(
      DeviceConnectionErrorType.FAILED_TO_CONNECT,
    );
  }

  const app = await ManagerApp.create(connection);

  await app.authDevice({ email, cysyncVersion });

  return true;
};

export const setupDeviceListeners = async (webContents: WebContents) => {
  firmwareWebContents = webContents;

  const onChange = () => {
    if (!webContents.isDestroyed()) {
      webContents.send(`${ipcConfig.listeners.usbConnectionChange}`);
    }
  };

  usb.on('attach', onChange);
  usb.on('detach', onChange);
};

export const removeDeviceListeners = async () => {
  usb.removeAllListeners();
};

export const getDeviceIPCHandlers = () => [
  {
    name: ipcConfig.methods.connectDevice,
    func: connectDevice,
  },
  {
    name: ipcConfig.methods.getDevices,
    func: getDevices,
  },
  {
    name: ipcConfig.methods.connectedDeviceMethodCall,
    func: connectedDeviceMethodCall,
  },
  {
    name: ipcConfig.methods.updateDeviceFirmware,
    func: updateDeviceFirmware,
  },
  {
    name: ipcConfig.methods.authenticateDevice,
    func: authenticateDevice,
  },
];
