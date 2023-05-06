import { IDatabase, IDeviceRepository } from '@cypherock/db-interfaces';

class DeviceData {
  repo: IDeviceRepository;

  allRequired = [
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

  setRepository(db: IDatabase) {
    this.repo = db.device;
  }
}
export const deviceData = new DeviceData();
