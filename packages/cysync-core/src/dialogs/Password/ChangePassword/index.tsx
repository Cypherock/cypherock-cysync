import { BlurOverlay } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import {
  ChangePasswordDialogProvider,
  useChangePasswordDialog,
} from './context';

const ChangePassword: FC = () => {
  const { currentDialog, tabs, currentTab } = useChangePasswordDialog();

  return <BlurOverlay>{tabs[currentTab]?.dialogs[currentDialog]}</BlurOverlay>;
};

export const ChangePasswordDialog: FC = () => (
  <ChangePasswordDialogProvider>
    <ChangePassword />
  </ChangePasswordDialogProvider>
);
