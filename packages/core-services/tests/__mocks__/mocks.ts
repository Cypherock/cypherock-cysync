import { jest } from '@jest/globals';
import {
  IDatabase,
  IWallet,
  IAccount,
  ITransaction,
} from '@cypherock/db-interfaces';

const mockWalletInsert = jest
  .fn<(entities: IWallet[]) => Promise<IWallet[]>>()
  .mockResolvedValue([]);
const mockWalletUpdate = jest
  .fn<(filter: { __id: string }, entity: IWallet) => Promise<IWallet>>()
  .mockResolvedValue({} as IWallet);
const mockWalletRemove = jest
  .fn<(filter: { __id?: string; walletId?: string }) => Promise<void>>()
  .mockResolvedValue(undefined);

const mockAccountInsert = jest
  .fn<(entities: IAccount[]) => Promise<IAccount[]>>()
  .mockResolvedValue([]);
const mockAccountUpdate = jest
  .fn<(filter: { __id: string }, entity: IAccount) => Promise<IAccount>>()
  .mockResolvedValue({} as IAccount);
const mockAccountRemove = jest
  .fn<(filter: { __id?: string; walletId?: string }) => Promise<void>>()
  .mockResolvedValue(undefined);

const mockTransactionInsert = jest
  .fn<(entities: ITransaction[]) => Promise<ITransaction[]>>()
  .mockResolvedValue([]);
const mockTransactionUpdate = jest
  .fn<
    (filter: { __id: string }, entity: ITransaction) => Promise<ITransaction>
  >()
  .mockResolvedValue({} as ITransaction);
const mockTransactionRemove = jest
  .fn<(filter: { __id?: string; walletId?: string }) => Promise<void>>()
  .mockResolvedValue(undefined);

export const mockDb: Partial<IDatabase> = {
  wallet: {
    insert: mockWalletInsert,
    update: mockWalletUpdate,
    remove: mockWalletRemove,
  },
  account: {
    insert: mockAccountInsert,
    update: mockAccountUpdate,
    remove: mockAccountRemove,
  },
  transaction: {
    insert: mockTransactionInsert,
    update: mockTransactionUpdate,
    remove: mockTransactionRemove,
  },
} as unknown as IDatabase;
