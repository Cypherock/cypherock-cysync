import { OnboardingStep } from '@cypherock/sdk-app-manager';
import { DeviceState, IDevice } from '@cypherock/sdk-interfaces';

export enum DeviceConnectionStatus {
  CONNECTED,
  UPDATE_REQUIRED,
  UNKNOWN_ERROR,
}

export interface IDeviceConnectionInfo {
  device: IDevice;
  deviceState: DeviceState;
  firmwareVersion?: string;
  serial?: string;
  isAuthenticated?: boolean;
  isMain: boolean;
  isInitial: boolean;
  isBootloader: boolean;
  status: DeviceConnectionStatus;
  onboardingStep: OnboardingStep;
}

export interface IDeviceConnectionRetry {
  device: IDevice;
  retries: number;
}

export interface IParseDeviceAction {
  type: 'disconnected' | 'try-connection';
  device?: IDevice;
}
