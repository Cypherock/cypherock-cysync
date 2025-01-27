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
      generateErrorHandlingDetails.retryWithReport(),
    [ServerErrorType.LOGIN_FAILED]:
      generateErrorHandlingDetails.retryWithReport(),
    [ServerErrorType.SIGNATURE_VERIFICATION_FAILED]:
      generateErrorHandlingDetails.retryWithReport(),
    [ServerErrorType.INVALID_REQUEST]:
      generateErrorHandlingDetails.retryWithReport(),
    [ServerErrorType.UNAUTHORIZED_ACCESS]:
      generateErrorHandlingDetails.report(),
    [ServerErrorType.RESOURCE_NOT_FOUND]:
      generateErrorHandlingDetails.retryWithReport(),
    [ServerErrorType.INTERNAL_SERVER_ERROR]:
      generateErrorHandlingDetails.retryWithReport(),
    [ServerErrorType.REQUEST_TIMEOUT]:
      generateErrorHandlingDetails.retryWithReport(),
    [ServerErrorType.OTP_EXPIRED]: generateErrorHandlingDetails.retry(),
    [ServerErrorType.PAYLOAD_VALIDATION_ERROR]:
      generateErrorHandlingDetails.retryWithReport(),
    [ServerErrorType.MAX_RETRIES_EXCEEDED]:
      generateErrorHandlingDetails.report(),
    [ServerErrorType.ACCOUNT_LOCKED]: generateErrorHandlingDetails.report(),
    [ServerErrorType.SERVICE_UNAVAILABLE]:
      generateErrorHandlingDetails.retryWithReport(),
    [ServerErrorType.REQUEST_CONFLICT]:
      generateErrorHandlingDetails.retryWithReport(),
    [ServerErrorType.VALIDATION_ERROR]:
      generateErrorHandlingDetails.retryWithReport(),
    [ServerErrorType.MISSING_WALLET]:
      generateErrorHandlingDetails.retryWithReport(),
    [ServerErrorType.MISSING_USER]:
      generateErrorHandlingDetails.retryWithReport(),
    [ServerErrorType.MISSING_NOMINEE]:
      generateErrorHandlingDetails.retryWithReport(),
    [ServerErrorType.MISSING_EXECUTOR]:
      generateErrorHandlingDetails.retryWithReport(),
    [ServerErrorType.MISSING_SESSION]:
      generateErrorHandlingDetails.retryWithReport(),
    [ServerErrorType.INVALID_COUPON]:
      generateErrorHandlingDetails.retryWithReport(),
    [ServerErrorType.INVALID_SESSION]:
      generateErrorHandlingDetails.retryWithReport(),
    [ServerErrorType.INVALID_DEVICE]:
      generateErrorHandlingDetails.retryWithReport(),
    [ServerErrorType.INVALID_PRIVATE_KEY]:
      generateErrorHandlingDetails.retryWithReport(),
    [ServerErrorType.ACTIVE_PLAN_FOUND]:
      generateErrorHandlingDetails.retryWithReport(),
    [ServerErrorType.OTP_RESEND_LIMIT]:
      generateErrorHandlingDetails.retryWithReport(),
    [ServerErrorType.DUPLICATE_EMAIL]:
      generateErrorHandlingDetails.retryWithReport(),
    [ServerErrorType.TRANSACTION_BROADCAST_FAILED]:
      generateErrorHandlingDetails.retryWithReport(),
  };

  return serverErrorHandlingDetailsMap[errorCode];
};
