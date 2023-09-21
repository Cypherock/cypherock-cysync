import { BlurOverlay } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import {
  AuthenticateX1CardDialogProvider,
  useAuthenticateX1CardDialog,
} from './context';

const AuthenticateX1Card: FC = () => {
  const { currentDialog, tabs, currentTab } = useAuthenticateX1CardDialog();
  return <BlurOverlay>{tabs[currentTab]?.dialogs[currentDialog]}</BlurOverlay>;
};

export const AuthenticateX1CardDialog: FC = () => (
  <AuthenticateX1CardDialogProvider>
    <AuthenticateX1Card />
  </AuthenticateX1CardDialogProvider>
);
