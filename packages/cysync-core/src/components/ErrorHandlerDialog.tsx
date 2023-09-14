import { ErrorDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { IErrorHandlerParams, useErrorHandler } from '~/hooks';

export interface ErrorHandlerDialogProps extends IErrorHandlerParams {
  children?: React.ReactNode;
  textVariables?: object;
  showCloseButton?: boolean;
  suppressActions?: boolean;
}

export const ErrorHandlerDialog: React.FC<ErrorHandlerDialogProps> = ({
  children,
  error,
  onRetry,
  onClose,
  isOnboarding,
  textVariables,
  defaultMsg,
  showCloseButton,
  suppressActions,
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
      primaryActionText={
        suppressActions ? undefined : errorToShow.primaryAction.text
      }
      secondaryActionText={
        suppressActions ? undefined : errorToShow.secondaryAction?.text
      }
      onPrimaryClick={suppressActions ? undefined : onPrimaryClick}
      onSecondaryClick={suppressActions ? undefined : onSecondaryClick}
      title={`${errorToShow.heading} (${errorToShow.code})`}
      subtext={errorToShow.subtext}
      textVariables={textVariables}
      onClose={showCloseButton ? onClose : undefined}
    />
  );
};

ErrorHandlerDialog.defaultProps = {
  children: undefined,
  textVariables: undefined,
  showCloseButton: undefined,
  suppressActions: undefined,
};
