import { ErrorHandlingDetails, ErrorIconNameMap } from './types';

export * from './types';
export * from './deviceError';

export const defaultErrorHandlignDetails: ErrorHandlingDetails = {
  iconName: ErrorIconNameMap.default,
  action: {
    retry: true,
  },
};
