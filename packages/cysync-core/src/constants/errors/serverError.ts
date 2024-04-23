import { ServerErrorType } from '~/errors';
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
  };

  return serverErrorHandlingDetailsMap[errorCode];
};
