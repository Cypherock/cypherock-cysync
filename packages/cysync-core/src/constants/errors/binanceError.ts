import { BinanceErrorType } from '@cypherock/cysync-core-constants';

import { ILangState } from '~/store';

import { createErrorHandlingDetailsGenerator } from './helpers';
import { ErrorHandlingDetails, ErrorIconNameMap } from './types';

const generateErrorHandlingDetails = createErrorHandlingDetailsGenerator(
  ErrorIconNameMap.default,
);

export const getBinanceErrorHandlingDetails = (
  _lang: ILangState,
  errorCode: BinanceErrorType,
) => {
  const binanceErrorHandlingDetailsMap: Record<
    BinanceErrorType,
    ErrorHandlingDetails | undefined
  > = {
    [BinanceErrorType.SYSTEM_ERROR]:
      generateErrorHandlingDetails.retryWithReport(),
    [BinanceErrorType.SYSTEM_BUSY]:
      generateErrorHandlingDetails.retryWithReport(),
    [BinanceErrorType.ILLEGAL_PARAMETERS]:
      generateErrorHandlingDetails.retryWithReport(),
    [BinanceErrorType.MISSING_CLIENT_ID]: generateErrorHandlingDetails.report(),
    [BinanceErrorType.PARTNER_DISABLED]: generateErrorHandlingDetails.report(),
    [BinanceErrorType.ORDER_NOT_FOUND]:
      generateErrorHandlingDetails.retryWithReport(),
    [BinanceErrorType.UNSUPPORTED_ORDER_TYPE]:
      generateErrorHandlingDetails.retryWithReport(),
    [BinanceErrorType.PARTNER_NOT_FOUND]: generateErrorHandlingDetails.report(),
    [BinanceErrorType.PAYMENT_METHOD_NOT_SUPPORTED]:
      generateErrorHandlingDetails.retryWithReport(),
  };

  return binanceErrorHandlingDetailsMap[errorCode];
};
