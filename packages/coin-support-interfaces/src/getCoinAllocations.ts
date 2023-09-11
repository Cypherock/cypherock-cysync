import { IDatabase } from '@cypherock/db-interfaces';

export interface ICoinAllocation {
  assetId: string;
  balance: string;
  value: string;
  price: string;
}

export interface IGetCoinAllocationsParams {
  db: IDatabase;
  walletId?: string;
}

export interface IGetCoinAllocationsResult {
  allocations: ICoinAllocation[];
}
