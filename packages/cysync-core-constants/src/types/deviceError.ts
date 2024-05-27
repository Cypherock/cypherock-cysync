import { GetLogsErrorType } from '@cypherock/sdk-app-manager';
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
  | GetLogsErrorType
  | DeviceBootloaderErrorType
  | DeviceCommunicationErrorType
  | DeviceConnectionErrorType
  | DeviceCompatibilityErrorType
  | CardAppErrorType;

export interface IErrorMsg {
  heading: string;
  subtext?: string;
  deviceNavigationText?: string;
}
