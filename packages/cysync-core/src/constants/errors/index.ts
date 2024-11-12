import {
  ErrorActionMap,
  ErrorHandlingDetails,
  ErrorIconNameMap,
} from './types';

export * from './types';
export * from './deviceError';
export * from './databaseError';
export * from './serverError';
export * from './serverCoinError';

export const defaultErrorHandlignDetails: ErrorHandlingDetails = {
  iconName: ErrorIconNameMap.default,
  action: {
    name: ErrorActionMap.retry,
  },
};
