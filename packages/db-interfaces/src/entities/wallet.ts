import type { IEntity, IRepository } from './base';

export interface IWallet extends IEntity {
  name: string;
  hasPin: boolean;
  hasPassphrase: boolean;
  // foreign keys
  deviceId: string;
}

export type IWalletRepository = IRepository<IWallet>;
