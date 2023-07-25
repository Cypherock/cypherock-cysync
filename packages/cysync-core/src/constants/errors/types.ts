import { ErrorIconType } from '@cypherock/cysync-ui';

export const ErrorIconNameMap = {
  device: 'device' as ErrorIconType,
  default: 'default' as ErrorIconType,
} as const;

export const ErrorActionMap = {
  /*
   * Show only retry button
   */
  retry: 'retry',
  /*
   * Show only report button
   */
  report: 'report',
  /*
   * Show only help button
   */
  help: 'help',
  /*
   * Show both retry and report buttons
   */
  retryWithHelp: 'retryWithHelp',
  /*
   * Show both retry and help buttons
   */
  retryWithReport: 'retryWithReport',
  /**
   * Show retry button, and after retrying a certain number of times
   * show only report
   */
  reportAfterRetry: 'reportAfterRetry',
  /*
   * Update device firmware
   */
  updateFirmware: 'updateFirmware',
  /*
   * Update both cysync app and device to latest
   */
  update: 'update',
  /*
   * Start onboarding
   */
  toOnboarding: 'toOnboarding',
  /*
   * Wallet does not exist on the device
   *
   * Delete: Delete the given wallet from cysync
   * Keep it: Keep the given wallet
   */
  walletDoesNotExistOnDevice: 'walletDoesNotExistOnDevice',
} as const;

export type ErrorActionType =
  (typeof ErrorActionMap)[keyof typeof ErrorActionMap];

/**
 * Only one of these actions should be specified
 */
export interface ErrorAction {
  name: ErrorActionType;
  // Identifier of the help section to open when Help button is clicked
  helpId?: string;
  // Max retries when action is `reportAfterRetry`
  maxRetries?: number;
  buttonText?: string;
}

export interface ErrorHandlingDetails {
  iconName: ErrorIconType;
  action: ErrorAction;
}
