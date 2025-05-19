import { BlurOverlay } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { MobileAppSyncDialogProvider, useMobileAppSyncDialog } from './context';

const MobileAppSync: FC = () => {
  const { currentDialog, tabs, currentTab } = useMobileAppSyncDialog();

  return <BlurOverlay>{tabs[currentTab]?.dialogs[currentDialog]}</BlurOverlay>;
};

export const MobileAppSyncDialog: FC = () => (
  <MobileAppSyncDialogProvider>
    <MobileAppSync />
  </MobileAppSyncDialogProvider>
);
