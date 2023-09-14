import { BlurOverlay } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { ErrorHandlerDialog, closeDialog, useAppDispatch } from '..';

export interface ErrorDialogProps {
  error: Error;
  onRetry?: () => void;
  showCloseButton?: boolean;
  suppressActions?: boolean;
}

export const ErrorDialog: FC<ErrorDialogProps> = ({
  error,
  onRetry,
  showCloseButton,
  suppressActions,
}) => {
  const dispatch = useAppDispatch();

  const onClose = () => {
    dispatch(closeDialog('errorDialog'));
  };

  return (
    <BlurOverlay>
      <ErrorHandlerDialog
        error={error}
        onClose={onClose}
        onRetry={onRetry}
        showCloseButton={showCloseButton}
        suppressActions={suppressActions}
      />
    </BlurOverlay>
  );
};

ErrorDialog.defaultProps = {
  onRetry: undefined,
  showCloseButton: undefined,
  suppressActions: undefined,
};
