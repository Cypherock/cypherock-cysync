import { BlurOverlay } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { ErrorHandlerDialog, closeDialog, useAppDispatch } from '..';

export interface ErrorDialogProps {
  error: Error;
  onRetry?: () => void;
  onClose?: () => void;
  showCloseButton?: boolean;
  suppressActions?: boolean;
}

export const ErrorDialog: FC<ErrorDialogProps> = ({
  error,
  onRetry,
  onClose,
  showCloseButton,
  suppressActions,
}) => {
  const dispatch = useAppDispatch();

  const handleOnClose = () => {
    if (onClose) {
      onClose();
    }
    dispatch(closeDialog('errorDialog'));
  };

  return (
    <BlurOverlay>
      <ErrorHandlerDialog
        error={error}
        onClose={handleOnClose}
        onRetry={onRetry}
        showCloseButton={showCloseButton}
        suppressActions={suppressActions}
      />
    </BlurOverlay>
  );
};

ErrorDialog.defaultProps = {
  onRetry: undefined,
  onClose: undefined,
  showCloseButton: undefined,
  suppressActions: undefined,
};
