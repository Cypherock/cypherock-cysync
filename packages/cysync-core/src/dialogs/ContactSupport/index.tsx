import { BlurOverlay } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import {
  ContactSupportDialogProvider,
  useContactSupportDialog,
} from './context';

const ContactSupport: FC = () => {
  const { currentDialog, tabs, currentTab } = useContactSupportDialog();

  return <BlurOverlay>{tabs[currentTab]?.dialogs[currentDialog]}</BlurOverlay>;
};

export const ContactSupportDialog: FC = () => (
  <ContactSupportDialogProvider>
    <ContactSupport />
  </ContactSupportDialogProvider>
);
