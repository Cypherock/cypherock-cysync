import { ServerCoinErrorTypes } from '@cypherock/cysync-core-constants';

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
  unknown: generateErrorHandlingDetails.report(),
};

export const getServerCoinErrorHandlingDetails = (
  errorCode: ServerCoinErrorTypes,
) =>
  serverCoinErrorHandlingDetailsMap[errorCode] ??
  serverCoinErrorHandlingDetailsMap['unknown'];
