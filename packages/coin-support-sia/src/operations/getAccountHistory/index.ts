import {
  IGetAccountHistoryParams,
  IGetAccountHistoryResult,
} from '@cypherock/coin-support-interfaces';
import { createGetAccountHistory } from '@cypherock/coin-support-utils';

export const getAccountHistory = async (
  params: IGetAccountHistoryParams,
): Promise<IGetAccountHistoryResult> =>
  createGetAccountHistory({
    ...params,
  });
