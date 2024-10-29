import { BlurOverlay } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { ErrorHandlerDialog } from '~/components';

import {
  InheritanceEditReminderTimeDialogProps,
  InheritanceEditReminderTimeDialogProvider,
  useInheritanceEditReminderTimeDialog,
} from './context';

const InheritanceEditReminderTime: FC = () => {
  const { tabs, currentTab, currentDialog, unhandledError, onClose, onRetry } =
    useInheritanceEditReminderTimeDialog();

  return (
    <BlurOverlay>
      <ErrorHandlerDialog
        onClose={onClose}
        error={unhandledError}
        onRetry={onRetry}
        showCloseButton
        noDelay
      >
        {tabs[currentTab]?.dialogs[currentDialog]}
      </ErrorHandlerDialog>
    </BlurOverlay>
  );
};

export const InheritanceEditReminderTimeDialog: FC<
  InheritanceEditReminderTimeDialogProps
> = props => (
  <InheritanceEditReminderTimeDialogProvider {...props}>
    <InheritanceEditReminderTime />
  </InheritanceEditReminderTimeDialogProvider>
);
