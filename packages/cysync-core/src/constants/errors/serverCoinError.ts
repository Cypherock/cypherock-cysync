import {
  DefaultCoinErrorType,
  ServerCoinErrorTypes,
  XrpServerErrorType,
} from '@cypherock/cysync-core-constants';

import { createErrorHandlingDetailsGenerator } from './helpers';
import { ErrorHandlingDetails, ErrorIconNameMap } from './types';

const generateErrorHandlingDetails = createErrorHandlingDetailsGenerator(
  ErrorIconNameMap.default,
);

// fill the map as u define coin errors
const serverCoinErrorHandlingDetailsMap: Record<
  ServerCoinErrorTypes,
  ErrorHandlingDetails | undefined
> = {
  [DefaultCoinErrorType.DEFAULT]: generateErrorHandlingDetails.report(),
  [XrpServerErrorType.UNKNOWN_ERROR]: generateErrorHandlingDetails.report(),
  [XrpServerErrorType.BROADCAST_FAILED]:
    generateErrorHandlingDetails.retryWithReport(),
};

export const getServerCoinErrorHandlingDetails = (
  errorCode: ServerCoinErrorTypes,
) =>
  serverCoinErrorHandlingDetailsMap[errorCode] ??
  serverCoinErrorHandlingDetailsMap[DefaultCoinErrorType.DEFAULT];
