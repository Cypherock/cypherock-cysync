import { BlurOverlay } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { EditAccountDialogProvider, useEditAccountDialog } from './context';

const EditAccount: FC = () => {
  const { tabs } = useEditAccountDialog();

  return <BlurOverlay>{tabs[0]?.dialogs[0]}</BlurOverlay>;
};

export const EditAccountDialog: FC = () => (
  <EditAccountDialogProvider>
    <EditAccount />
  </EditAccountDialogProvider>
);
