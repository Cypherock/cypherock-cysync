import { IGetOrderDetailsParams, IGetOrderDetailsResult } from './types';

import { binanceService } from '../../services';

export * from './types';

export const getOrderDetails = async (
  params: IGetOrderDetailsParams,
): Promise<IGetOrderDetailsResult> => {
  const result = await binanceService.getOrderDetails(params);

  return result;
};
