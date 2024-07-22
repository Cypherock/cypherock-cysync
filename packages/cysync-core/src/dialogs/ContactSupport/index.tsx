import { BlurOverlay } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import {
  ContactSupportDialogProvider,
  useContactSupportDialog,
} from './context';
import { IContactSupportDialogProps } from './context/types';

export * from './context/types';

const ContactSupport: FC = () => {
  const { currentDialog, tabs, currentTab } = useContactSupportDialog();

  return <BlurOverlay>{tabs[currentTab]?.dialogs[currentDialog]}</BlurOverlay>;
};

export const ContactSupportDialog: FC<IContactSupportDialogProps> = props => (
  <ContactSupportDialogProvider {...props}>
    <ContactSupport />
  </ContactSupportDialogProvider>
);
