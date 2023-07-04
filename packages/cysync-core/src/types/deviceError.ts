import {
  DeviceAppErrorType,
  DeviceBootloaderErrorType,
  DeviceCommunicationErrorType,
  DeviceCompatibilityErrorType,
  DeviceConnectionErrorType,
} from '@cypherock/sdk-interfaces';

export type DeviceErrorCodes =
  | DeviceAppErrorType
  | DeviceBootloaderErrorType
  | DeviceCommunicationErrorType
  | DeviceConnectionErrorType
  | DeviceCompatibilityErrorType;
