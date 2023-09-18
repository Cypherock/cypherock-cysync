import { IGetCoinAllocationsParams } from '@cypherock/coin-support-interfaces';
import { IDatabase } from '@cypherock/db-interfaces';

export interface ICreateGetCoinAllocationsParams
  extends IGetCoinAllocationsParams {
  getCoinIds: (
    db: IDatabase,
  ) => Promise<{ assetId: string; parentAssetId: string }[]>;
}
