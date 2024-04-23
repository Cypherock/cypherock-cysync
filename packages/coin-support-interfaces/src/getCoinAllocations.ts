import { IDatabase } from '@cypherock/db-interfaces';

export interface ICoinAllocation {
  parentAssetId: string;
  assetId: string;
  balance: string;
  value: string;
  price: string;
}

export interface IGetCoinAllocationsParams {
  db: IDatabase;
  walletId?: string;
  parentAssetId?: string;
  assetId?: string;
}

export interface IGetCoinAllocationsResult {
  allocations: ICoinAllocation[];
}
