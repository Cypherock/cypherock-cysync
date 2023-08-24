import { IGetCoinAllocationsParams } from '@cypherock/coin-support-interfaces';

export interface ICreateGetCoinAllocationsParams
  extends IGetCoinAllocationsParams {
  getCoinIds: (params: IGetCoinAllocationsParams) => Promise<string[]>;
}
