import { BlurOverlay } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { ErrorHandlerDialog } from '~/components';

import {
  InheritanceSyncPlansDialogProvider,
  useInheritanceSyncPlansDialog,
} from './context';

const InheritanceSyncPlans: FC = () => {
  const { tabs, currentTab, currentDialog, unhandledError, onClose, onRetry } =
    useInheritanceSyncPlansDialog();

  return (
    <BlurOverlay>
      <ErrorHandlerDialog
        onClose={onClose}
        onRetry={onRetry}
        error={unhandledError}
        showCloseButton
        noDelay
      >
        {tabs[currentTab]?.dialogs[currentDialog]}
      </ErrorHandlerDialog>
    </BlurOverlay>
  );
};

export const InheritanceSyncPlansDialog = () => (
  <InheritanceSyncPlansDialogProvider>
    <InheritanceSyncPlans />
  </InheritanceSyncPlansDialogProvider>
);
