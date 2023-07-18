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

const getConnection = async () => {
  if (!connectionInstance) {
    return createConnection();
  }

  return connectionInstance;
};

const cleanUp = async () => {
  (await getConnection()).destroy();
};

export type IMain = (connection: IDeviceConnection) => Promise<void>;

export const runWithDevice = async (main: IMain) => {
  try {
    const connection = await createConnection();
    await main(connection);
    await cleanUp();
  } catch (error: any) {
    await cleanUp();
    console.error(error);
  }
};
