import { assert } from '@cypherock/cysync-utils';

import { IGetPaymentMethodsParams, IPaymentMethod } from './types';

import { binanceService } from '../../services';

export * from './types';

export const getPaymentMethods = async (
  params: IGetPaymentMethodsParams,
): Promise<IPaymentMethod[]> => {
  assert(
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    params.cryptoAmount || params.fiatAmount,
    'Either cryptoAmount or fiatAmount must be provided',
  );

  const result = await binanceService.getPaymentMethodList({
    totalAmount: params.fiatAmount ?? params.cryptoAmount ?? '',
    fiatCurrency: params.fiatCurrency.code,
    cryptoCurrency: params.cryptoCurrency.cryptoCurrency,
    amountType: params.fiatAmount ? 1 : 2,
    language: params.language,
  });

  return result.paymentMethods;
};
