import {
  coinFamiliesMapWithDefault,
  CoinFamilyWithDefault,
  DeviceErrorCodes,
  ServerCoinError,
  ServerCoinErrorTypes,
  ServerError,
  BinanceServerError,
  BinanceErrorType,
  ServerErrorType,
} from '@cypherock/cysync-core-constants';

import {
  defaultErrorHandlignDetails,
  ErrorActionMap,
  getDatabaseErrorHandlingDetails,
  getDeviceErrorHandlingDetails,
  getServerCoinErrorHandlingDetails,
  getServerErrorHandlingDetails,
} from '~/constants/errors';
import { getBinanceErrorHandlingDetails } from '~/constants/errors/binanceError';
import { ILangState } from '~/store';

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
export const createServerErrorFromError = (
  error: any,
  type?: ServerErrorType,
) => {
  if (error?.isAxiosError) {
    if (error.response?.data?.isBinanceError) {
      return new BinanceServerError(error.response.data.code, undefined, {
        advanceText: error.response.data.cysyncError,
        responseBody: error.response.data,
        url: error.request?.url,
        status: error.response.status,
      });
    }
    if (error.response && error.response.data?.coinErrorCode) {
      return new ServerCoinError({
        coinFamily: error.response.data.coinFamily,
        code: error.response.data.coinErrorCode,
        message: error.response.data.coinError,
        details: {
          responseBody: error?.response?.data,
          url: error?.request?.url,
          status: error?.response?.status,
        },
      });
    }
    if (error.response) {
      return new ServerError(type ?? ServerErrorType.UNKNOWN_ERROR, undefined, {
        advanceText: error?.response?.data?.cysyncError,
        responseBody: error?.response?.data,
        url: error?.request?.url,
        status: error?.response?.status,
      });
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

  const errorToParse = createServerErrorFromError(error) ?? error;

  let heading = params.defaultMsg ?? lang.strings.errors.default;
  let subtext: string | undefined;
  let deviceNavigationText: string | undefined;
  let advanceText: string | undefined;
  let details = defaultErrorHandlignDetails;

  if (errorToParse?.isCustomError) {
    heading = errorToParse.custom.heading;
    subtext = errorToParse.custom.subtext;

    details = errorToParse.custom.details ?? details;
  } else if (errorToParse?.isDeviceError && errorToParse.code) {
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

    advanceText = errorToParse?.details?.advanceText;
    details = getServerErrorHandlingDetails(lang, errorToParse.code) ?? details;
  } else if (errorToParse?.isBinanceError && errorToParse.code) {
    heading =
      lang.strings.errors.binanceErrors[errorToParse.code as BinanceErrorType]
        .heading ?? heading;
    subtext =
      lang.strings.errors.binanceErrors[errorToParse.code as BinanceErrorType]
        .subtext;

    advanceText = errorToParse?.details?.advanceText;
    details =
      getBinanceErrorHandlingDetails(lang, errorToParse.code) ?? details;
  } else if (errorToParse?.isServerCoinError && errorToParse.code) {
    const serverCoinErrors =
      lang.strings.errors.serverCoinErrors[
        errorToParse.coinFamily as CoinFamilyWithDefault
      ] ??
      lang.strings.errors.serverCoinErrors[coinFamiliesMapWithDefault.default];

    heading =
      errorToParse.message ??
      (serverCoinErrors &&
        serverCoinErrors[errorToParse.code as ServerCoinErrorTypes].heading);
    subtext =
      serverCoinErrors &&
      serverCoinErrors[errorToParse.code as ServerCoinErrorTypes].subtext;

    details = getServerCoinErrorHandlingDetails(errorToParse.code) ?? details;
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
    advanceText,
    primaryAction,
    secondaryAction,
    rawError: errorToParse?.toJSON ? errorToParse.toJSON() : errorToParse,
  };
};
