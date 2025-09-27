import { IEntity, IRepository } from './base';

export const BuySellStatusMap = {
  created: 'created',
  pending: 'pending',
  hold: 'hold',
  refunded: 'refunded',
  expired: 'expired',
  failed: 'failed',
  completed: 'completed',
} as const;

interface IPaymentMethod {
  code: string;
  name: string;
}

export type IBuySellStatus =
  (typeof BuySellStatusMap)[keyof typeof BuySellStatusMap];

export interface IBuySellOrder extends IEntity {
  id: string;

  provider: string;

  paymentMethod: IPaymentMethod;
  currencyFrom: string;
  amountFrom: string;
  amountTo: string;

  country: string;

  status: IBuySellStatus;

  accountId: string;
  walletId: string;
  assetId: string;
  familyId: string;
  parentAssetId: string;

  createdAt: string;
  updatedAt: string;
}

export type IBuySellOrderRepository = IRepository<IBuySellOrder>;
