import {
  DeviceAppError,
  DeviceAppErrorType,
  IDevice,
} from '@cypherock/sdk-interfaces';

const DEFAULT_TIMEOUT = 10_000;
const DEFAULT_RECHECK_TIME = 100;
const MAX_LOCK_TIME = 10 * 1000;

interface Lock {
  id: string;
  at: number;
}

const deviceLockMap: Record<string, Lock | undefined> = {};

const getDeviceKey = (device: IDevice) =>
  `${device.path}:${device.productId}:${device.vendorId}:${device.serial}:${device.type}`;

const hasLock = (device: IDevice) => {
  const key = getDeviceKey(device);

  const lock = deviceLockMap[key];
  let someoneHasLock = false;

  if (!lock) {
    someoneHasLock = false;
  } else {
    someoneHasLock = lock.at + MAX_LOCK_TIME > Date.now();
  }

  return someoneHasLock;
};

const addLock = (device: IDevice, id: string) => {
  deviceLockMap[getDeviceKey(device)] = { id, at: Date.now() };
};

export const aquireDeviceLock = (
  device: IDevice,
  id: string,
  timeout = DEFAULT_TIMEOUT,
): Promise<void> =>
  new Promise((resolve, reject) => {
    let timeoutId: any;

    if (!hasLock(device)) {
      addLock(device, id);
      resolve();
      return;
    }

    const maxRecheckTime = Date.now() + timeout;

    const recheck = () => {
      if (!hasLock(device)) {
        addLock(device, id);
        resolve();
        return;
      }

      if (Date.now() >= maxRecheckTime) {
        clearTimeout(timeoutId);
        reject(new DeviceAppError(DeviceAppErrorType.EXECUTING_OTHER_COMMAND));
      } else {
        timeoutId = setTimeout(recheck, DEFAULT_RECHECK_TIME);
      }
    };

    timeoutId = setTimeout(recheck, DEFAULT_RECHECK_TIME);
  });

export const releaseDeviceLock = (device: IDevice) => {
  deviceLockMap[getDeviceKey(device)] = undefined;
};
