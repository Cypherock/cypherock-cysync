import React from 'react';

import { DEVICE_LISTENER_INTERVAL } from '~/context/device/helpers';
import { selectLanguage, useAppSelector } from '~/store';
import { getParsedError, IParsedError } from '~/utils/error';

export interface IErrorHandlerParams {
  error?: Error;
  defaultMsg?: string;
  onRetry?: () => void;
}

export const useErrorHandler = (params: IErrorHandlerParams) => {
  const { error, defaultMsg, onRetry } = params;

  const [errorToShow, setErrorToShow] = React.useState<
    IParsedError | undefined
  >();
  const [retries, setRetries] = React.useState<number>(0);
  const lang = useAppSelector(selectLanguage);

  const errorMsg = React.useMemo(
    () =>
      error ? getParsedError({ error, defaultMsg, lang, retries }) : undefined,
    [error, lang, retries],
  );

  const handleRetry = () => {
    if (onRetry) {
      setRetries(r => r + 1);
      onRetry();
    }
  };

  /**
   * We need to wait for a certain time before showing the error because:
   *
   * If the device is disconnected, it'll be recognized by the application
   * after ${DEVICE_LISTENER_INTERVAL} ms.
   * And we don't want to show any errors if the device is disconnected.
   */
  React.useEffect(() => {
    let timeout: any;

    if (errorMsg) {
      timeout = setTimeout(() => {
        setErrorToShow(errorMsg);
      }, DEVICE_LISTENER_INTERVAL);
    } else if (errorToShow) {
      setErrorToShow(undefined);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [errorMsg]);

  return {
    errorToShow,
    handleRetry,
  };
};
