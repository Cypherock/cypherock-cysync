import { ErrorDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { closeDialog, useAppDispatch } from '~/store';

export const WalletSyncError = () => {
  const dispatch = useAppDispatch();

  const onClose = () => {
    dispatch(closeDialog('walletSyncError'));
  };

  return (
    <ErrorDialog
      $isModal
      title="Wallet sync error"
      iconType="misconfigured"
      showRetry
      onRetry={onClose}
    />
  );
};
