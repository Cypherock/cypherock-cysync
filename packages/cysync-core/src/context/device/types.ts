import {
  IGetWalletsResultResponse,
  OnboardingStep,
} from '@cypherock/sdk-app-manager';
import {
  DeviceState,
  IDevice,
  IDeviceConnection,
} from '@cypherock/sdk-interfaces';

export enum DeviceConnectionStatus {
  CONNECTED,
  INCOMPATIBLE,
  BUSY,
  UNKNOWN_ERROR,
}

export interface IDeviceConnectionInfo {
  device: IDevice;
  connection?: IDeviceConnection;
  deviceState: DeviceState;
  firmwareVersion?: string;
  serial?: string;
  isAuthenticated?: boolean;
  isMain: boolean;
  isInitial: boolean;
  isBootloader: boolean;
  status: DeviceConnectionStatus;
  onboardingStep: OnboardingStep;
  walletList?: IGetWalletsResultResponse['walletList'];
}

export interface IDeviceConnectionRetry {
  device: IDevice;
  retries: number;
  retryTimeout?: NodeJS.Timeout;
}

export interface IParseDeviceAction {
  type: 'disconnected' | 'try-connection';
  device?: IDevice;
}

export enum DeviceHandlingState {
  NOT_CONNECTED,
  INCOMPATIBLE,
  BOOTLOADER,
  NOT_ONBOARDED,
  NOT_AUTHENTICATED,
  USABLE,
  BUSY,
  UNKNOWN_ERROR,
}
