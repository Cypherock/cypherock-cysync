import { BlurOverlay } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import {
  ContactSupportDialogProvider,
  IContactSupportDialogProps,
  useContactSupportDialog,
} from './context';

export type { IContactSupportDialogProps } from './context';

const ContactSupport: FC = () => {
  const { currentDialog, tabs, currentTab } = useContactSupportDialog();

  return <BlurOverlay>{tabs[currentTab]?.dialogs[currentDialog]}</BlurOverlay>;
};

export const ContactSupportDialog: FC<IContactSupportDialogProps> = props => (
  <ContactSupportDialogProvider {...props}>
    <ContactSupport />
  </ContactSupportDialogProvider>
);
