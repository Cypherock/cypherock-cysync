import { BlurOverlay } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import {
  RemovePasswordDialogProvider,
  useRemovePasswordDialog,
} from './context';

const RemovePassword: FC = () => {
  const { currentDialog, tabs, currentTab } = useRemovePasswordDialog();

  return <BlurOverlay>{tabs[currentTab]?.dialogs[currentDialog]}</BlurOverlay>;
};

export const RemovePasswordDialog: FC = () => (
  <RemovePasswordDialogProvider>
    <RemovePassword />
  </RemovePasswordDialogProvider>
);
