import { ErrorDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { IErrorHandlerParams, useErrorHandler } from '~/hooks';

export interface ErrorHandlerDialogProps extends IErrorHandlerParams {
  children?: React.ReactNode;
  textVariables?: object;
}

export const ErrorHandlerDialog: React.FC<ErrorHandlerDialogProps> = ({
  children,
  error,
  onRetry,
  onClose,
  isOnboarding,
  textVariables,
  defaultMsg,
}) => {
  const { errorToShow, onPrimaryClick, onSecondaryClick } = useErrorHandler({
    error,
    isOnboarding,
    onRetry,
    onClose,
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
      primaryActionText={errorToShow.primaryAction.text}
      secondaryActionText={errorToShow.secondaryAction?.text}
      onPrimaryClick={onPrimaryClick}
      onSecondaryClick={onSecondaryClick}
      title={`${errorToShow.heading} (${errorToShow.code})`}
      subtext={errorToShow.subtext}
      textVariables={textVariables}
    />
  );
};

ErrorHandlerDialog.defaultProps = {
  children: undefined,
  textVariables: undefined,
};
