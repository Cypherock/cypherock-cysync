import { BlurOverlay } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { ErrorHandlerDialog } from '~/components';

import {
  InheritanceEditUserDetailsDialogProvider,
  useInheritanceEditUserDetailsDialog,
} from './context';

const InheritanceEditUserDetails: FC = () => {
  const { tabs, currentTab, currentDialog, unhandledError, onClose } =
    useInheritanceEditUserDetailsDialog();

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

export const InheritanceEditUserDetailsDialog = () => (
  <InheritanceEditUserDetailsDialogProvider>
    <InheritanceEditUserDetails />
  </InheritanceEditUserDetailsDialogProvider>
);
