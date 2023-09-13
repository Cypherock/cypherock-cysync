import { BlurOverlay } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import {
  CySyncVersionDetailsDialogProvider,
  useCySyncVersionDetailsDialog,
} from './context';

const CySyncVersionDetails: FC = () => {
  const { currentDialog, tabs, currentTab } = useCySyncVersionDetailsDialog();

  return <BlurOverlay>{tabs[currentTab]?.dialogs[currentDialog]}</BlurOverlay>;
};

export const CySyncVersionDetailsDialog: FC = () => (
  <CySyncVersionDetailsDialogProvider>
    <CySyncVersionDetails />
  </CySyncVersionDetailsDialogProvider>
);
