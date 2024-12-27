import { assert } from '@cypherock/cysync-utils';

import { IEstimatedQuote, IGetEstimatedQuoteParams } from './types';

import { binanceService } from '../../services';

export * from './types';

export const getEstimatedQuote = async (
  params: IGetEstimatedQuoteParams,
): Promise<IEstimatedQuote> => {
  assert(
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    params.cryptoAmount || params.fiatAmount,
    'Either cryptoAmount or fiatAmount must be provided',
  );

  const quote = await binanceService.getEstimatedQuote({
    requestedAmount: params.fiatAmount ?? params.cryptoAmount ?? '',
    fiatCurrency: params.fiatCurrency.code,
    cryptoCurrency: params.cryptoCurrency.cryptoCurrency,
    network: params.cryptoCurrency.network,
    amountType: params.fiatAmount ? 1 : 2,
  });

  return quote;
};
