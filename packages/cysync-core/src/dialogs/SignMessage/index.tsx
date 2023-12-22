import { BlurOverlay, DialogBox } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { WithConnectedDevice } from '~/components';

import { SignMessageDialogProvider, useSignMessageDialog } from './context';

const DeviceConnectionWrapper: React.FC<{
  isDeviceRequired: boolean;
  children: React.ReactNode;
}> = ({ isDeviceRequired, children }) => {
  if (isDeviceRequired)
    return <WithConnectedDevice>{children}</WithConnectedDevice>;
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};
const SignMessage: FC = () => {
  const { currentDialog, tabs, currentTab, isDeviceRequired, onClose } =
    useSignMessageDialog();

  return (
    <BlurOverlay>
      <DialogBox direction="row" gap={0} align="center" onClose={onClose}>
        <DeviceConnectionWrapper isDeviceRequired={isDeviceRequired}>
          {tabs[currentTab]?.dialogs[currentDialog]}
        </DeviceConnectionWrapper>
      </DialogBox>
    </BlurOverlay>
  );
};

export const SignMessageDialog: FC = () => (
  <SignMessageDialogProvider>
    <SignMessage />
  </SignMessageDialogProvider>
);
