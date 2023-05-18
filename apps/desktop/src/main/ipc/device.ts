import { DeviceConnection as DeviceConnectionHID } from '@cypherock/sdk-hw-hid';
import { DeviceConnection as DeviceConnectionSerialPort } from '@cypherock/sdk-hw-serialport';
import {
  ConnectionTypeMap,
  DeviceConnectionError,
  DeviceConnectionErrorType,
  IDevice,
  IDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { GetDevices } from '@cypherock/cysync-interfaces';
import { ipcConfig } from './config';

const getDevices: GetDevices = async () => {
  const hidDevices = await DeviceConnectionHID.list();

  const serialDevices = await DeviceConnectionSerialPort.list();

  return [...hidDevices, ...serialDevices];
};

let connectedDevice:
  | { device: IDevice; connection: IDeviceConnection }
  | undefined;

const removeConnectedDevice = async () => {
  if (connectedDevice) {
    await connectedDevice.connection.destroy();
    connectedDevice = undefined;
  }
};

const connectDevice = async (device: IDevice) => {
  await removeConnectedDevice();
  let connection: IDeviceConnection;

  if (device.type === ConnectionTypeMap.HID) {
    connection = await DeviceConnectionHID.connect(device);
  } else {
    connection = await DeviceConnectionSerialPort.connect(device);
  }

  connectedDevice = { device, connection };
  return device.path;
};

const connectedDeviceMethodCall = async (
  device: IDevice,
  method: string,
  ...args: any[]
) => {
  if (device.path !== connectedDevice?.device.path) {
    throw new DeviceConnectionError(DeviceConnectionErrorType.NOT_CONNECTED);
  }

  return (connectedDevice.connection as any)[method](...args);
};

export const getDeviceIPCHandlers = () => [
  {
    name: ipcConfig.connectDevice,
    func: connectDevice,
  },
  {
    name: ipcConfig.getDevices,
    func: getDevices,
  },
  {
    name: ipcConfig.connectedDeviceMethodCall,
    func: connectedDeviceMethodCall,
  },
];
