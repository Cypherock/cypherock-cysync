import type { IBaseEntity, IBaseRepository } from './base';

export interface IPriceInfo extends IBaseEntity {
  currency: string;
  latestPrice: string;
  // foreign keys
  assetId: string;
}

export type IPriceInfoRepository = IBaseRepository<IPriceInfo>;
