import { createErrorHandlingDetailsGenerator } from './helpers';
import { ErrorIconNameMap } from './types';

const generateErrorHandlingDetails = createErrorHandlingDetailsGenerator(
  ErrorIconNameMap.default,
);

export const getDatabaseErrorHandlingDetails = () =>
  generateErrorHandlingDetails.retry();
