import {
  IDatabase,
  IDevice,
  IDeviceRepository,
} from '@cypherock/db-interfaces';

import { ITestClass } from './types';

class DeviceData implements ITestClass<IDevice> {
  name = 'Device';

  sortKey = 'serial';

  isSortDescending = true;

  repo: IDeviceRepository;

  sorted: IDevice[] = [
    {
      serial: '4567',
      isAuthenticated: true,
      version: '1.0.4',
    },
    {
      serial: '3456',
      isAuthenticated: false,
      version: '1.0.3',
    },
    {
      serial: '2345',
      isAuthenticated: true,
      version: '1.0.1',
    },
    {
      serial: '1234',
      isAuthenticated: false,
      version: '1.0.0',
    },
  ];

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

  partial: Partial<IDevice>[] = [
    {
      isAuthenticated: false,
      version: '1.0.0',
    },
    {
      serial: '2345',
      version: '1.0.1',
    },
    {
      isAuthenticated: false,
      version: '1.0.3',
    },
    {
      serial: '4567',
      isAuthenticated: true,
    },
  ];

  all = this.onlyRequired;

  invalid: IDevice[] = [
    {
      serial: null as any,
      isAuthenticated: true,
      version: '1.0.1',
    },
    {
      serial: '2345',
      isAuthenticated: (() => 'random') as any,
      version: '1.0.3',
    },
    {
      serial: '3456',
      isAuthenticated: false,
      version: 34 as any,
    },
    {
      serial: null as any,
      isAuthenticated: (() => 'random') as any,
      version: 34 as any,
    },
  ];

  setRepository(db: IDatabase) {
    this.repo = db.device;
  }
}
export const deviceData = new DeviceData();
