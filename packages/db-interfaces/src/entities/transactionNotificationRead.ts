import type { IEntity, IRepository } from './base';
import { TransactionStatus } from './transaction';

export interface ITransactionNotificationRead extends IEntity {
  transactionId: string;
  transactionStatus: TransactionStatus;
  isRead: boolean;
}

export type ITransactionNotificationReadRepository =
  IRepository<ITransactionNotificationRead>;
