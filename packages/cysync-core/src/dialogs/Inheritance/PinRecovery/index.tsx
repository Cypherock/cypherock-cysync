import { BlurOverlay } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { ErrorHandlerDialog } from '~/components';

import {
  InheritancePinRecoveryDialogProvider,
  useInheritancePinRecoveryDialog,
} from './context';

const InheritancePinRecovery: FC = () => {
  const { tabs, currentTab, currentDialog, unhandledError, onClose } =
    useInheritancePinRecoveryDialog();

  return (
    <BlurOverlay>
      <ErrorHandlerDialog
        onClose={onClose}
        error={unhandledError}
        showCloseButton
        noDelay
      >
        {tabs[currentTab]?.dialogs[currentDialog]}
      </ErrorHandlerDialog>
    </BlurOverlay>
  );
};

export const InheritancePinRecoveryDialog = () => (
  <InheritancePinRecoveryDialogProvider>
    <InheritancePinRecovery />
  </InheritancePinRecoveryDialogProvider>
);
