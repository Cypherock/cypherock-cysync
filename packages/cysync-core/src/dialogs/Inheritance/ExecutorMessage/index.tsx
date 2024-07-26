import { BlurOverlay } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { ErrorHandlerDialog } from '~/components';

import {
  InheritanceExecutorMessageDialogProvider,
  useInheritanceExecutorMessageDialog,
} from './context';

const InheritanceExecutorMessage: FC = () => {
  const { tabs, currentTab, currentDialog, unhandledError, onClose } =
    useInheritanceExecutorMessageDialog();

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

export const InheritanceExecutorMessageDialog = () => (
  <InheritanceExecutorMessageDialogProvider>
    <InheritanceExecutorMessage />
  </InheritanceExecutorMessageDialogProvider>
);
