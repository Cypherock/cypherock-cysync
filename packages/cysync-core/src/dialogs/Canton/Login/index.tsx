import { BlurOverlay } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { ErrorHandlerDialog } from '~/components';

import { CantonLoginDialogProvider, useCantonLoginDialog } from './context';

const CantonLogin: FC = () => {
  const { tabs, currentTab, currentDialog, onClose, error, onRetry } =
    useCantonLoginDialog();

  return (
    <BlurOverlay>
      <ErrorHandlerDialog
        error={error}
        onClose={onClose}
        onRetry={onRetry}
        selectedWallet={undefined}
      >
        {tabs[currentTab]?.dialogs[currentDialog]}
      </ErrorHandlerDialog>
    </BlurOverlay>
  );
};

export const CantonLoginDialog: FC = () => (
  <CantonLoginDialogProvider>
    <CantonLogin />
  </CantonLoginDialogProvider>
);

export default CantonLoginDialog;
