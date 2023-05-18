import type { IEntity, IRepository, IGetOptions, ObjectLiteral } from './base';

export type Status = 'pending' | 'failed' | 'success';

export type TransactionType = 'receive' | 'send' | 'swap';

export interface IAddressInfo {
  address: string;
  amount: string;
  isMine: boolean;
}

export interface ITransaction extends IEntity {
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
  walletId: string;
  assetId: string;
  familyId: string;
  parentTransactionId?: string;
  parentAccountId?: string;
  parentAssetId?: string;
}

export interface IDetailedTransaction extends ITransaction {
  accountName: string;
  walletName: string;
  value: string; // balance in unit fetched from price info
}

export interface ITransactionRepository extends IRepository<ITransaction> {
  getTransactionList: (
    params: IGetOptions<ITransaction>,
  ) => Promise<IDetailedTransaction[]>;
}
