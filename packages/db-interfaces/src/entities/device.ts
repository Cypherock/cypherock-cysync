import type { IEntity, IRepository } from './base';

export interface IDevice extends IEntity {
  serial: string;
  version: string;
  isAuthenticated: boolean;
}

export type IDeviceRepository = IRepository<IDevice>;
