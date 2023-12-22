import {
  ErrorAction,
  ErrorActionType,
  ErrorHandlingDetails,
} from '~/constants/errors';
import { ILangState } from '~/store';

export const ErrorActionButtonHandlerMap = {
  retry: 'retry',
  report: 'report',
  help: 'help',
  updateFirmware: 'updateFirmware',
  update: 'update',
  toOnboarding: 'toOnboarding',
  deleteWallets: 'deleteWallets',
  close: 'close',
} as const;

export type ErrorActionButtonHandler =
  (typeof ErrorActionButtonHandlerMap)[keyof typeof ErrorActionButtonHandlerMap];

export interface IErrorActionButtonDetails {
  text: string;
  action: ErrorAction;
  handler: ErrorActionButtonHandler;
}

export interface IParsedError extends ErrorHandlingDetails {
  code: string;
  heading: string;
  subtext?: string;
  deviceNavigationText?: string;
  primaryAction: IErrorActionButtonDetails;
  secondaryAction?: IErrorActionButtonDetails;
}

export type GetErrorActionButtonDetails = (params: {
  action: ErrorAction;
  lang: ILangState;
  retries?: number;
}) => {
  primaryAction: IErrorActionButtonDetails;
  secondaryAction?: IErrorActionButtonDetails;
};

export const actionButtonDetailsMap: Record<
  ErrorActionType,
  GetErrorActionButtonDetails
> = {
  retry: ({ lang, action }) => ({
    primaryAction: {
      text: lang.strings.buttons.retry,
      action,
      handler: ErrorActionButtonHandlerMap.retry,
    },
  }),
  report: ({ lang, action }) => ({
    primaryAction: {
      text: lang.strings.buttons.report,
      action,
      handler: ErrorActionButtonHandlerMap.report,
    },
  }),
  help: ({ lang, action }) => ({
    primaryAction: {
      text: lang.strings.buttons.help,
      action,
      handler: ErrorActionButtonHandlerMap.help,
    },
  }),
  retryWithHelp: ({ lang, action }) => ({
    primaryAction: {
      text: lang.strings.buttons.retry,
      action,
      handler: ErrorActionButtonHandlerMap.retry,
    },
    secondaryAction: {
      text: lang.strings.buttons.help,
      action,
      handler: ErrorActionButtonHandlerMap.help,
    },
  }),
  retryWithReport: ({ lang, action }) => ({
    primaryAction: {
      text: lang.strings.buttons.retry,
      action,
      handler: ErrorActionButtonHandlerMap.retry,
    },
    secondaryAction: {
      text: lang.strings.buttons.report,
      action,
      handler: ErrorActionButtonHandlerMap.report,
    },
  }),
  reportAfterRetry: ({ lang, action, retries }) => {
    if (action.maxRetries && retries && retries >= action.maxRetries) {
      return {
        primaryAction: {
          text: lang.strings.buttons.report,
          action,
          handler: ErrorActionButtonHandlerMap.report,
        },
      };
    }

    return {
      primaryAction: {
        text: lang.strings.buttons.retry,
        action,
        handler: ErrorActionButtonHandlerMap.retry,
      },
    };
  },
  updateFirmware: ({ lang, action }) => ({
    primaryAction: {
      text: lang.strings.buttons.update,
      action,
      handler: ErrorActionButtonHandlerMap.updateFirmware,
    },
  }),
  update: ({ lang, action }) => ({
    primaryAction: {
      text: lang.strings.buttons.update,
      action,
      handler: ErrorActionButtonHandlerMap.update,
    },
  }),
  toOnboarding: ({ lang, action }) => ({
    primaryAction: {
      text: action.buttonText ?? lang.strings.buttons.continue,
      action,
      handler: ErrorActionButtonHandlerMap.toOnboarding,
    },
  }),
  walletDoesNotExistOnDevice: ({ lang, action }) => ({
    primaryAction: {
      text: lang.strings.walletSync.buttons.delete,
      action,
      handler: ErrorActionButtonHandlerMap.deleteWallets,
    },
    secondaryAction: {
      text: lang.strings.walletSync.buttons.keepIt,
      action,
      handler: ErrorActionButtonHandlerMap.close,
    },
  }),
};
