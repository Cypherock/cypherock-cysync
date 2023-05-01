import type { IEntity, IRepository } from './base';

export interface IPriceInfo extends IEntity {
  currency: string;
  latestPrice: string;
  // foreign keys
  assetId: string;
}

export type IPriceInfoRepository = IRepository<IPriceInfo>;
