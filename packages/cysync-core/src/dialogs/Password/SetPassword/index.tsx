import { BlurOverlay } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { SetPasswordDialogProvider, useSetPasswordDialog } from './context';

const SetPassword: FC = () => {
  const { currentDialog, tabs, currentTab } = useSetPasswordDialog();

  return <BlurOverlay>{tabs[currentTab]?.dialogs[currentDialog]}</BlurOverlay>;
};

export const SetPasswordDialog: FC = () => (
  <SetPasswordDialogProvider>
    <SetPassword />
  </SetPasswordDialogProvider>
);
