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

let connectedDevices: { device: IDevice; connection: IDeviceConnection }[] = [];

const removeConnectedDevices = async () => {
  for (const dev of connectedDevices) {
    await dev.connection.destroy();
  }
  connectedDevices = [];
};

const connectDevice = async (device: IDevice) => {
  await removeConnectedDevices();
  let connection: IDeviceConnection;

  if (device.type === ConnectionTypeMap.HID) {
    connection = await DeviceConnectionHID.connect(device);
  } else {
    connection = await DeviceConnectionSerialPort.connect(device);
  }

  connectedDevices.push({ device, connection });
  return device.path;
};

const connectedDeviceMethodCall = async (
  device: IDevice,
  method: string,
  ...args: any[]
) => {
  const connection = connectedDevices.find(e => e.device.path === device.path);

  if (!connection) {
    throw new DeviceConnectionError(DeviceConnectionErrorType.NOT_CONNECTED);
  }

  return (connection.connection as any)[method](...args);
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
