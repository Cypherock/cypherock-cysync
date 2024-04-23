import { GetDevices } from '@cypherock/cysync-interfaces';
import { DeviceConnection as DeviceConnectionHID } from '@cypherock/sdk-hw-hid';
import { DeviceConnection as DeviceConnectionSerialPort } from '@cypherock/sdk-hw-serialport';
import {
  DeviceConnectionError,
  DeviceConnectionErrorType,
  IDevice,
} from '@cypherock/sdk-interfaces';
import { WebContents } from 'electron';
import { usb } from 'usb';

import { ipcConfig } from './helpers/config';
import { callMethodOnObject, getMethodListFromObject } from './helpers/utils';

import * as deviceUtils from '../utils/device';

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

export const setupDeviceListeners = async (webContents: WebContents) => {
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
];
