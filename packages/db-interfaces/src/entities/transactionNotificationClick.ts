import type { IEntity, IRepository } from './base';
import { TransactionStatus } from './transaction';

export interface ITransactionNotificationClick extends IEntity {
  transactionId: string;
  isClicked: boolean;
  transactionStatus: TransactionStatus;
}

export type ITransactionNotificationClickRepository =
  IRepository<ITransactionNotificationClick>;
