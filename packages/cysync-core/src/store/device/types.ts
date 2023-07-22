import { IDevice } from '@cypherock/db-interfaces';

export interface IDeviceState {
  isLoaded: boolean;
  devices: IDevice[];
}
