import { ErrorIconType } from '@cypherock/cysync-ui';

import { ErrorHandlingDetails, ErrorActionMap } from './types';

export const createErrorHandlingDetailsGenerator = (
  defaultIcon: ErrorIconType,
) => ({
  retry: (): ErrorHandlingDetails => ({
    iconName: defaultIcon,
    action: {
      name: ErrorActionMap.retry,
    },
  }),
  report: (): ErrorHandlingDetails => ({
    iconName: defaultIcon,
    action: {
      name: ErrorActionMap.report,
    },
  }),
  help: (helpId: string): ErrorHandlingDetails => ({
    iconName: defaultIcon,
    action: {
      name: ErrorActionMap.help,
      helpId,
    },
  }),
  retryWithReport: (): ErrorHandlingDetails => ({
    iconName: defaultIcon,
    action: {
      name: ErrorActionMap.retryWithReport,
    },
  }),
  retryWithHelp: (helpId: string): ErrorHandlingDetails => ({
    iconName: defaultIcon,
    action: {
      name: ErrorActionMap.retryWithHelp,
      helpId,
    },
  }),
  updateFirmware: (): ErrorHandlingDetails => ({
    iconName: defaultIcon,
    action: {
      name: ErrorActionMap.updateFirmware,
    },
  }),
  update: (): ErrorHandlingDetails => ({
    iconName: defaultIcon,
    action: {
      name: ErrorActionMap.update,
    },
  }),
  toOnboarding: (buttonText: string): ErrorHandlingDetails => ({
    iconName: defaultIcon,
    action: {
      name: ErrorActionMap.toOnboarding,
      buttonText,
    },
  }),
  walletDoesNotExistOnDevice: (): ErrorHandlingDetails => ({
    iconName: defaultIcon,
    action: {
      name: ErrorActionMap.walletDoesNotExistOnDevice,
    },
  }),
});
