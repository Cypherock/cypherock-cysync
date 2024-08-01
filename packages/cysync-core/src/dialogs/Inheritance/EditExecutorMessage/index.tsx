import { BlurOverlay } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { ErrorHandlerDialog } from '~/components';

import {
  InheritanceEditExecutorMessageDialogProvider,
  useInheritanceEditExecutorMessageDialog,
} from './context';

const InheritanceEditExecutorMessage: FC = () => {
  const { tabs, currentTab, currentDialog, unhandledError, onClose } =
    useInheritanceEditExecutorMessageDialog();

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

export const InheritanceEditExecutorMessageDialog = () => (
  <InheritanceEditExecutorMessageDialogProvider>
    <InheritanceEditExecutorMessage />
  </InheritanceEditExecutorMessageDialogProvider>
);
