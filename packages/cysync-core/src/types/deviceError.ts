import {
  DeviceAppErrorType,
  DeviceBootloaderErrorType,
  DeviceCommunicationErrorType,
  DeviceCompatibilityErrorType,
  DeviceConnectionErrorType,
  CardAppErrorType,
} from '@cypherock/sdk-interfaces';

export type DeviceErrorCodes =
  | DeviceAppErrorType
  | DeviceBootloaderErrorType
  | DeviceCommunicationErrorType
  | DeviceConnectionErrorType
  | DeviceCompatibilityErrorType
  | CardAppErrorType;

export interface IErrorMsg {
  heading: string;
  subtext?: string;
}
