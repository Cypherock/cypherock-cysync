import {
  IGetCoinAllocationsParams,
  IGetCoinAllocationsResult,
} from '@cypherock/coin-support-interfaces';
import { createGetCoinAllocations } from '@cypherock/coin-support-utils';

import { getCoinIds } from '../../utils';

export const getCoinAllocations = async (
  params: IGetCoinAllocationsParams,
): Promise<IGetCoinAllocationsResult> =>
  createGetCoinAllocations({
    ...params,
    getCoinIds,
  });
