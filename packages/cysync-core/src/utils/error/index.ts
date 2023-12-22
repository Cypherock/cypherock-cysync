import {
  defaultErrorHandlignDetails,
  ErrorActionMap,
  getDatabaseErrorHandlingDetails,
  getDeviceErrorHandlingDetails,
  getServerErrorHandlingDetails,
} from '~/constants/errors';
import { ServerError, ServerErrorType } from '~/errors';
import { ILangState } from '~/store';
import { DeviceErrorCodes } from '~/types/deviceError';

import {
  actionButtonDetailsMap,
  ErrorActionButtonHandlerMap,
  IErrorActionButtonDetails,
  IParsedError,
} from './types';

export * from './types';

/**
 * Assuming we are using axios for server calls
 */
const identifyServerErrors = (error: any) => {
  if (error?.isAxiosError) {
    if (error.response) {
      return new ServerError(ServerErrorType.UNKNOWN_ERROR);
    }

    return new ServerError(ServerErrorType.CONNOT_CONNECT);
  }

  return undefined;
};

export const getParsedError = (params: {
  error: any;
  defaultMsg?: string;
  lang: ILangState;
  retries?: number;
}): IParsedError => {
  const { error, lang, retries } = params;

  const errorToParse = identifyServerErrors(error) ?? error;

  let heading = params.defaultMsg ?? lang.strings.errors.default;
  let subtext: string | undefined;
  let deviceNavigationText: string | undefined;
  let details = defaultErrorHandlignDetails;

  if (errorToParse?.isDeviceError && errorToParse.code) {
    heading =
      lang.strings.errors.deviceErrors[errorToParse.code as DeviceErrorCodes]
        .heading ?? heading;
    subtext =
      lang.strings.errors.deviceErrors[errorToParse.code as DeviceErrorCodes]
        .subtext;
    deviceNavigationText =
      lang.strings.errors.deviceErrors[errorToParse.code as DeviceErrorCodes]
        .deviceNavigationText;

    details =
      getDeviceErrorHandlingDetails(lang, errorToParse.code as any) ?? details;
  } else if (errorToParse?.isDatabaseError && errorToParse.code) {
    heading = lang.strings.errors.databaseError.heading;
    subtext = lang.strings.errors.databaseError.subtext;

    details = getDatabaseErrorHandlingDetails() ?? details;
  } else if (errorToParse?.isServerError && errorToParse.code) {
    heading =
      lang.strings.errors.serverErrors[errorToParse.code as ServerErrorType]
        .heading ?? heading;
    subtext =
      lang.strings.errors.serverErrors[errorToParse.code as ServerErrorType]
        .subtext;

    details = getServerErrorHandlingDetails(lang, errorToParse.code) ?? details;
  }

  let primaryAction: IErrorActionButtonDetails = {
    text: lang.strings.buttons.retry,
    action: { name: ErrorActionMap.retry },
    handler: ErrorActionButtonHandlerMap.retry,
  };
  let secondaryAction: IErrorActionButtonDetails | undefined;

  const getActionButtonDetails = actionButtonDetailsMap[details.action.name];

  if (getActionButtonDetails) {
    const actionButtonDetails = getActionButtonDetails({
      lang,
      action: details.action,
      retries,
    });
    primaryAction = actionButtonDetails.primaryAction;
    secondaryAction = actionButtonDetails.secondaryAction;
  }

  return {
    ...details,
    code: errorToParse.code,
    heading,
    subtext,
    deviceNavigationText,
    primaryAction,
    secondaryAction,
  };
};
