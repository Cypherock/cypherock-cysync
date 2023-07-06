import { ErrorIconType } from '@cypherock/cysync-ui';

export const ErrorIconNameMap = {
  device: 'device' as ErrorIconType,
  default: 'default' as ErrorIconType,
} as const;

/**
 * Only one of these actions should be specified
 */
export interface ErrorAction {
  /*
   * Show only retry button
   */
  retry?: boolean;

  /*
   * Show only report button
   */
  report?: boolean;

  /*
   * Show both retry and report buttons
   */
  reportWithRetry?: boolean;

  /**
   * Show retry button, but only after retrying a certain number of times
   * show only report
   */
  reportAfterRetry?: {
    maxRetries: number;
  };
}

export interface ErrorHandlingDetails {
  iconName: ErrorIconType;
  action: ErrorAction;
}
