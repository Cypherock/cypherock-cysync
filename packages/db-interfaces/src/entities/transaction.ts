import type {
  IBaseEntity,
  IBaseRepository,
  IGetOptions,
  ObjectLiteral,
} from './base';

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

export interface ITransaction extends IBaseEntity {
  hash: string;
  fees: string;
  amount: string;
  status: Status;
  type: TransactionType;
  timestamp: number;
  blockHeight: number;
  inputs: IAddressInfo[];
  outputs: IAddressInfo[];
  confirmations?: number;
  extraData?: ObjectLiteral;
  // foreign keys
  accountId: string;
  parentTransactionId?: string;
}

export interface IHistoryListItemInfo extends ITransaction {
  accountName: string;
  walletName: string;
  value: string; // balance in unit fetched from price info
}

export interface ITransactionRepository extends IBaseRepository<ITransaction> {
  getHistoryList: (
    params: IGetOptions<ITransaction>,
  ) => Promise<IHistoryListItemInfo[]>;
}
