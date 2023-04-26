import type { IBaseEntity, IBaseRepository } from './base';

export interface IDevice extends IBaseEntity {
  serial: string;
  version: string;
  isAuthenticated: boolean;
}

export type IDeviceRepository = IBaseRepository<IDevice>;
