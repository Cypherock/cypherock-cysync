import { BlurOverlay } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { ErrorHandlerDialog } from '~/components';

import {
  InheritanceEditReminderTimeDialogProvider,
  useInheritanceEditReminderTimeDialog,
} from './context';

const InheritanceEditReminderTime: FC = () => {
  const { tabs, currentTab, currentDialog, unhandledError, onClose } =
    useInheritanceEditReminderTimeDialog();

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

export const InheritanceEditReminderTimeDialog = () => (
  <InheritanceEditReminderTimeDialogProvider>
    <InheritanceEditReminderTime />
  </InheritanceEditReminderTimeDialogProvider>
);
