import { BlurOverlay } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { AddTokenDialogProvider, useAddTokenDialog } from './context';

export interface AddTokenDialogProps {
  walletId?: string;
}

const AddNewToken: FC = () => {
  const { tabs, currentTab, currentDialog } = useAddTokenDialog();

  return <BlurOverlay>{tabs[currentTab]?.dialogs[currentDialog]}</BlurOverlay>;
};

export const AddTokenDialog: FC<AddTokenDialogProps> = props => (
  <AddTokenDialogProvider {...props}>
    <AddNewToken />
  </AddTokenDialogProvider>
);

AddTokenDialog.defaultProps = {
  walletId: undefined,
};
