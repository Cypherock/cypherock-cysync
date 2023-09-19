import { BlurOverlay } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import {
  AuthenticateX1VaultDialogProvider,
  useAuthenticateX1VaultDialog,
} from './context';

const AuthenticateX1Vault: FC = () => {
  const { currentDialog, tabs, currentTab } = useAuthenticateX1VaultDialog();

  return <BlurOverlay>{tabs[currentTab]?.dialogs[currentDialog]}</BlurOverlay>;
};

export const AuthenticateX1VaultDialog: FC = () => (
  <AuthenticateX1VaultDialogProvider>
    <AuthenticateX1Vault />
  </AuthenticateX1VaultDialogProvider>
);
