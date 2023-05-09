import {
  IDatabase,
  IDevice,
  IDeviceRepository,
} from '@cypherock/db-interfaces';
import { ITestClass } from './types';

class DeviceData implements ITestClass<IDevice> {
  name = 'Device';

  repo: IDeviceRepository;

  onlyRequired: IDevice[] = [
    {
      serial: '1234',
      isAuthenticated: false,
      version: '1.0.0',
    },
    {
      serial: '2345',
      isAuthenticated: true,
      version: '1.0.1',
    },
    {
      serial: '3456',
      isAuthenticated: false,
      version: '1.0.3',
    },
    {
      serial: '4567',
      isAuthenticated: true,
      version: '1.0.4',
    },
  ];

  partial = [];

  all = [];

  setRepository(db: IDatabase) {
    this.repo = db.device;
  }
}
export const deviceData = new DeviceData();
