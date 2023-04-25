import type { IAccount } from './account';
import type { IBaseRepository, ObjectLiteral } from './baseRepository';

export enum Status {
  Pending = 0,
  Failed,
  Success,
}

export enum TransactionType {
  Receive = 0,
  Send,
  Swap,
}

export interface IAddressInfo {
  address: string;
  amount: string;
  isMine: boolean;
}

export interface ITransaction {
  id: string;
  hash: string;
  fees: string;
  amount: string;
  status: Status;
  type: TransactionType;
  timestamp: number;
  blockHeight: number;
  inputs: IAddressInfo[];
  outputs: IAddressInfo[];
  confirmations: number;
  assetSpecificData: ObjectLiteral;
}
export interface ITransactionRepository extends IBaseRepository<ITransaction> {
  getParent(transaction: ITransaction): Promise<ITransaction>;
  getChildren(transaction: ITransaction): Promise<ITransaction[]>;
  getAccount(transaction: ITransaction): Promise<IAccount>;
}
