import {
  IGetCoinAllocationsParams,
  IGetCoinAllocationsResult,
} from '@cypherock/coin-support-interfaces';
import { createGetCoinAllocations } from '@cypherock/coin-support-utils';
import { solanaCoinList } from '@cypherock/coins';

const getCoinIds = async () => Object.keys(solanaCoinList);

export const getCoinAllocations = async (
  params: IGetCoinAllocationsParams,
): Promise<IGetCoinAllocationsResult> =>
  createGetCoinAllocations({
    ...params,
    getCoinIds,
  });
