import { ServerErrorType } from '@cypherock/cysync-core-constants';

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
    [ServerErrorType.UNKNOWN_ERROR]:
      generateErrorHandlingDetails.retryWithReport(),
    [ServerErrorType.CONNOT_CONNECT]: generateErrorHandlingDetails.retry(),

    [ServerErrorType.OTP_VERIFICATION_FAILED]:
      generateErrorHandlingDetails.retry(),
    [ServerErrorType.LOGIN_FAILED]: generateErrorHandlingDetails.retry(),
    [ServerErrorType.SIGNATURE_VERIFICATION_FAILED]:
      generateErrorHandlingDetails.retry(),
    [ServerErrorType.INVALID_REQUEST]: generateErrorHandlingDetails.retry(),
    [ServerErrorType.UNAUTHORIZED_ACCESS]: generateErrorHandlingDetails.retry(),
    [ServerErrorType.RESOURCE_NOT_FOUND]: generateErrorHandlingDetails.retry(),
    [ServerErrorType.INTERNAL_SERVER_ERROR]:
      generateErrorHandlingDetails.retry(),
    [ServerErrorType.REQUEST_TIMEOUT]: generateErrorHandlingDetails.retry(),
    [ServerErrorType.OTP_EXPIRED]: generateErrorHandlingDetails.retry(),
    [ServerErrorType.PAYLOAD_VALIDATION_ERROR]:
      generateErrorHandlingDetails.retry(),
    [ServerErrorType.MAX_RETRIES_EXCEEDED]:
      generateErrorHandlingDetails.retry(),
    [ServerErrorType.ACCOUNT_LOCKED]: generateErrorHandlingDetails.retry(),
    [ServerErrorType.SERVICE_UNAVAILABLE]: generateErrorHandlingDetails.retry(),
    [ServerErrorType.REQUEST_CONFLICT]: generateErrorHandlingDetails.retry(),
  };

  return serverErrorHandlingDetailsMap[errorCode];
};
