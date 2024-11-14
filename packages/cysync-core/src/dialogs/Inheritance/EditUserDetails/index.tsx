import { BlurOverlay } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { ErrorHandlerDialog } from '~/components';
import { IUserDetails } from '../hooks';

import {
  InheritanceEditUserDetailsDialogProvider,
  useInheritanceEditUserDetailsDialog,
} from './context';

export type InheritanceEditUserDetailsUserType =
  | 'owner'
  | 'nominee 1'
  | 'nominee 2'
  | 'executor';

export interface InheritanceEditUserDetailsDialogProps {
  userType: InheritanceEditUserDetailsUserType;
  initialData?: IUserDetails;
  walletId: string;
}

const InheritanceEditUserDetails = () => {
  const { tabs, currentTab, currentDialog, unhandledError, onClose, onRetry } =
    useInheritanceEditUserDetailsDialog();

  return (
    <BlurOverlay>
      <ErrorHandlerDialog
        onClose={onClose}
        error={unhandledError}
        showCloseButton
        onRetry={onRetry}
        noDelay
      >
        {tabs[currentTab]?.dialogs[currentDialog]}
      </ErrorHandlerDialog>
    </BlurOverlay>
  );
};

export const InheritanceEditUserDetailsDialog: FC<
  InheritanceEditUserDetailsDialogProps
> = props => (
  <InheritanceEditUserDetailsDialogProvider {...props}>
    <InheritanceEditUserDetails />
  </InheritanceEditUserDetailsDialogProvider>
);

InheritanceEditUserDetailsDialog.defaultProps = {
  initialData: undefined,
};
