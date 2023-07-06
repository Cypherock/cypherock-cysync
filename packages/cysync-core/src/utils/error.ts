import {
  defaultErrorHandlignDetails,
  deviceErrorHandlingDetails,
  ErrorHandlingDetails,
} from '~/constants/errors';
import { ILangState } from '~/store';

export interface IParsedError extends ErrorHandlingDetails {
  msg: string;
  showRetry: boolean;
  showReport: boolean;
}

export const getParsedError = (params: {
  error: any;
  defaultMsg?: string;
  lang: ILangState;
  retries?: number;
}): IParsedError => {
  const { error, lang, retries } = params;

  let msg = params.defaultMsg ?? lang.strings.errors.default;
  let details = defaultErrorHandlignDetails;

  if (error && error.isDeviceError && error.code) {
    msg = (lang.strings.errors.deviceErrors as any)[error.code] ?? msg;
    details = (deviceErrorHandlingDetails as any)[error.code] ?? details;
  }

  let showRetry =
    details.action.retry ?? details.action.reportWithRetry ?? false;
  let showReport =
    details.action.report ?? details.action.reportWithRetry ?? false;

  if (details.action.reportAfterRetry) {
    showRetry = true;
    showReport = false;

    if (retries && retries >= details.action.reportAfterRetry.maxRetries) {
      showRetry = false;
      showReport = true;
    }
  }

  return { ...details, msg, showReport, showRetry };
};
