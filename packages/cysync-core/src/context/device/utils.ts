import { ResourceLock } from '@cypherock/cysync-utils';
import {
  DeviceAppError,
  DeviceAppErrorType,
  IDevice,
} from '@cypherock/sdk-interfaces';

const DEFAULT_TIMEOUT = 10_000;
const MAX_LOCK_TIME = 10 * 1000;

const getDeviceKey = (device: IDevice) =>
  `${device.path}:${device.productId}:${device.vendorId}:${device.serial}:${device.type}`;

export const deviceLock = new ResourceLock<IDevice>(getDeviceKey, {
  timeout: DEFAULT_TIMEOUT,
  maxLockTime: MAX_LOCK_TIME,
  createAcquireError: () =>
    new DeviceAppError(DeviceAppErrorType.EXECUTING_OTHER_COMMAND),
});
