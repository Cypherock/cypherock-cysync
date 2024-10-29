import type { IEntity, IRepository } from './base';

export const InheritancePlanTypeMap = {
  gold: 'gold',
  silver: 'silver',
} as const;

export type InheritancePlanType =
  (typeof InheritancePlanTypeMap)[keyof typeof InheritancePlanTypeMap];

export interface IInheritancePlan extends IEntity {
  walletId: string;
  walletName: string;
  type: InheritancePlanType;
  isNominee: boolean;
  purchasedAt?: number;
  expireAt?: number;
}

export type IInheritancePlanRepository = IRepository<IInheritancePlan>;
