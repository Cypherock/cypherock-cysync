import { ErrorDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { IErrorHandlerParams, useErrorHandler } from '~/hooks';

export interface ErrorHandlerDialogProps extends IErrorHandlerParams {
  children?: React.ReactNode;
  title: string;
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
  const { errorToShow, handleRetry } = useErrorHandler({
    error,
    onRetry,
    defaultMsg,
  });

  if (!errorToShow) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    if (children) return <>{children}</>;
    return null;
  }

  return (
    <ErrorDialog
      iconType={errorToShow.iconName}
      showRetry={errorToShow.showRetry}
      showReport={errorToShow.showReport}
      onRetry={handleRetry}
      title={title}
      subtext={errorToShow.msg}
      textVariables={textVariables}
    />
  );
};

ErrorHandlerDialog.defaultProps = {
  children: undefined,
  textVariables: undefined,
};
