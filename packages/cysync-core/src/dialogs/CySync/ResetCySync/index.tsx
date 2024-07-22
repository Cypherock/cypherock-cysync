import { BlurOverlay } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { ResetCySyncDialogProvider, useResetCySyncDialog } from './context';

const ResetCySync: FC = () => {
  const { currentDialog, tabs, currentTab } = useResetCySyncDialog();

  return <BlurOverlay>{tabs[currentTab]?.dialogs[currentDialog]}</BlurOverlay>;
};

export const ResetCySyncDialog: FC = () => (
  <ResetCySyncDialogProvider>
    <ResetCySync />
  </ResetCySyncDialogProvider>
);
