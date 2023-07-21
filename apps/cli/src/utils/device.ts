import { DeviceConnection as DeviceConnectionHID } from '@cypherock/sdk-hw-hid';
import { DeviceConnection as DeviceConnectionSerial } from '@cypherock/sdk-hw-serialport';
import {
  DeviceConnectionError,
  DeviceConnectionErrorType,
  IDevice,
  IDeviceConnection,
} from '@cypherock/sdk-interfaces';

let connectionInstance: IDeviceConnection | undefined;

export const getDevices = async () => {
  const devices = [
    ...(await DeviceConnectionHID.list()),
    ...(await DeviceConnectionSerial.list()),
  ];

  return devices;
};

export const connectDevice = async (
  device: IDevice,
): Promise<IDeviceConnection> => {
  if (connectionInstance) {
    await connectionInstance.destroy();
  }

  if (device.type === 'hid') {
    connectionInstance = await DeviceConnectionHID.connect(device);
    return connectionInstance;
  }

  connectionInstance = await DeviceConnectionSerial.connect(device);
  return connectionInstance;
};

export const createConnection = async () => {
  const devices = await getDevices();

  if (devices.length <= 0) {
    throw new DeviceConnectionError(DeviceConnectionErrorType.NOT_CONNECTED);
  }

  return connectDevice(devices[0]);
};

export const cleanUpDeviceConnection = async () => {
  await connectionInstance?.destroy();
};
