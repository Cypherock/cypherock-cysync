import { BlurOverlay } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { ErrorHandlerDialog } from '~/components';

import {
  InheritanceEditEncryptedMessageDialogProvider,
  useInheritanceEditEncryptedMessageDialog,
} from './context';

const InheritanceEditEncryptedMessage: FC = () => {
  const { tabs, currentTab, currentDialog, unhandledError, onClose } =
    useInheritanceEditEncryptedMessageDialog();

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

export const InheritanceEditEncryptedMessageDialog = () => (
  <InheritanceEditEncryptedMessageDialogProvider>
    <InheritanceEditEncryptedMessage />
  </InheritanceEditEncryptedMessageDialogProvider>
);
