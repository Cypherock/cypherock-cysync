import type { IBaseEntity, IBaseRepository } from './base';

export type WalletId = string;
export interface IWallet extends IBaseEntity {
  name: string;
  hasPin: boolean;
  hasPassphrase: boolean;
  // foreign keys
  deviceId: string;
}

export type IWalletRepository = IBaseRepository<IWallet>;
