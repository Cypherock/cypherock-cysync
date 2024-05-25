import { BlurOverlay } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { EditAccountDialogProvider, useEditAccountDialog } from './context';

export interface EditAccountDialogProps {
  walletId?: string;
  accountId?: string;
  isSkipAccountSelection?: boolean;
}

const EditAccount: FC = () => {
  const { tabs, currentTab, currentDialog } = useEditAccountDialog();
  return <BlurOverlay>{tabs[currentTab]?.dialogs[currentDialog]}</BlurOverlay>;
};

export const EditAccountDialog: FC<EditAccountDialogProps> = props => (
  <EditAccountDialogProvider {...props}>
    <EditAccount />
  </EditAccountDialogProvider>
);

EditAccountDialog.defaultProps = {
  walletId: undefined,
  accountId: undefined,
  isSkipAccountSelection: false,
};
