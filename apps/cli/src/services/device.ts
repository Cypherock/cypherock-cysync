import { DeviceConnection as DeviceConnectionHID } from '@cypherock/sdk-hw-hid';
import { DeviceConnection as DeviceConnectionSerial } from '@cypherock/sdk-hw-serialport';
import {
  DeviceConnectionError,
  DeviceConnectionErrorType,
  IDevice,
  IDeviceConnection,
} from '@cypherock/sdk-interfaces';

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
  if (device.type === 'hid') {
    return DeviceConnectionHID.connect(device);
  }

  return DeviceConnectionSerial.connect(device);
};

export const createConnection = async () => {
  const devices = await getDevices();

  if (devices.length <= 0) {
    throw new DeviceConnectionError(DeviceConnectionErrorType.NOT_CONNECTED);
  }

  return connectDevice(devices[0]);
};
