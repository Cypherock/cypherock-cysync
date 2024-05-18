import { ServerErrorType } from '@cypherock/coin-support-utils';
import { ILangState } from '~/store';

import { createErrorHandlingDetailsGenerator } from './helpers';
import { ErrorHandlingDetails, ErrorIconNameMap } from './types';

const generateErrorHandlingDetails = createErrorHandlingDetailsGenerator(
  ErrorIconNameMap.default,
);

export const getServerErrorHandlingDetails = (
  _lang: ILangState,
  errorCode: ServerErrorType,
) => {
  const serverErrorHandlingDetailsMap: Record<
    ServerErrorType,
    ErrorHandlingDetails | undefined
  > = {
    [ServerErrorType.UNKNOWN_ERROR]: generateErrorHandlingDetails.report(),
    [ServerErrorType.CONNOT_CONNECT]: generateErrorHandlingDetails.retry(),
    [ServerErrorType.INVALID_RESPONSE]:
      generateErrorHandlingDetails.retryWithReport(),
  };

  return serverErrorHandlingDetailsMap[errorCode];
};
