import { BlurOverlay, DialogBox } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { ErrorHandlerDialog, WithConnectedDevice } from '~/components';
import { useWalletConnect } from '~/context';

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
  const {
    currentDialog,
    tabs,
    currentTab,
    isDeviceRequired,
    onClose,
    error,
    onRetry,
  } = useSignMessageDialog();
  const { activeWallet } = useWalletConnect();

  return (
    <BlurOverlay>
      <DialogBox direction="row" gap={0} align="center" onClose={onClose}>
        <DeviceConnectionWrapper isDeviceRequired={isDeviceRequired}>
          <ErrorHandlerDialog
            error={error}
            onClose={onClose}
            onRetry={onRetry}
            selectedWallet={activeWallet}
          >
            {tabs[currentTab]?.dialogs[currentDialog]}
          </ErrorHandlerDialog>
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
