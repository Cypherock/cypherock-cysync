import React from 'react';
import { ErrorDialog } from '@cypherock/cysync-ui';

import { DEVICE_LISTENER_INTERVAL } from '~/context/device/helpers';
import { selectLanguage, useAppSelector } from '~/store';
import { getParsedError, IParsedError } from '~/utils/error';

export interface ErrorHandlerDialogProps {
  children?: React.ReactNode;
  error?: any;
  defaultMsg?: string;
  title: string;
  onRetry?: () => void;
  textVariables?: object;
}

export const ErrorHandlerDialog: React.FC<ErrorHandlerDialogProps> = ({
  children,
  error,
  title,
  onRetry,
  textVariables,
  defaultMsg,
}) => {
  const [errorToShow, setErrorToShow] = React.useState<
    IParsedError | undefined
  >();
  const lang = useAppSelector(selectLanguage);

  const errorMsg = React.useMemo(
    () => (error ? getParsedError({ error, defaultMsg, lang }) : undefined),
    [error, lang],
  );

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

  if (!errorToShow) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    if (children) return <>{children}</>;
    return null;
  }

  return (
    <ErrorDialog
      showRetry={errorToShow.showRetry}
      showReport={errorToShow.showSupport}
      onRetry={onRetry}
      title={title}
      subtext={errorToShow.msg}
      textVariables={textVariables}
    />
  );
};

ErrorHandlerDialog.defaultProps = {
  children: undefined,
  error: undefined,
  onRetry: undefined,
  textVariables: undefined,
  defaultMsg: undefined,
};
