import {
  IGetCoinAllocationsParams,
  IGetCoinAllocationsResult,
} from '@cypherock/coin-support-interfaces';
import { createGetCoinAllocations } from '@cypherock/coin-support-utils';
import { evmCoinList } from '@cypherock/coins';

const getCoinIds = async () => Object.keys(evmCoinList);

export const getCoinAllocations = async (
  params: IGetCoinAllocationsParams,
): Promise<IGetCoinAllocationsResult> =>
  createGetCoinAllocations({
    ...params,
    getCoinIds,
  });
