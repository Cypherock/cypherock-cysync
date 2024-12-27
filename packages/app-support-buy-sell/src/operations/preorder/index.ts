import { IPreorderParams, IPreorderResult } from './types';

import { binanceService } from '../../services';

export * from './types';

export const preorder = async (
  params: IPreorderParams,
): Promise<IPreorderResult> => {
  const result = await binanceService.preorder({
    ...params,
    fiatCurrency: params.fiatCurrency.code,
    cryptoCurrency: params.cryptoCurrency.cryptoCurrency,
    network: params.cryptoCurrency.network,
  });

  return result;
};
