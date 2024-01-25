import { ErrorDialog } from '@cypherock/cysync-ui';
import { IWallet } from '@cypherock/db-interfaces';
import React from 'react';

import { IErrorHandlerParams, useErrorHandler } from '~/hooks';

export interface ErrorHandlerDialogProps extends IErrorHandlerParams {
  children?: React.ReactNode;
  textVariables?: object;
  selectedWallet?: IWallet;
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
  selectedWallet,
  showCloseButton,
  suppressActions,
  noDelay,
}) => {
  const { errorToShow, onPrimaryClick, onSecondaryClick } = useErrorHandler({
    error,
    noDelay,
    isOnboarding,
    onRetry,
    onClose,
    defaultMsg,
    selectedWallet,
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
      deviceNavigationText={errorToShow.deviceNavigationText}
      textVariables={{
        walletName: selectedWallet?.name,
        ...(textVariables ?? {}),
      }}
      onClose={showCloseButton ? onClose : undefined}
    />
  );
};

ErrorHandlerDialog.defaultProps = {
  children: undefined,
  textVariables: undefined,
  selectedWallet: undefined,
  showCloseButton: undefined,
  suppressActions: undefined,
};
