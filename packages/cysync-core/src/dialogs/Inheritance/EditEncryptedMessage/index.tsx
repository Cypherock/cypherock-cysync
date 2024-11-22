import { BlurOverlay } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import {
  ErrorHandlerDialog,
  WithConnectedDevice,
  WithConnectedDeviceProps,
} from '~/components';

import {
  InheritanceEditEncryptedMessageDialogProvider,
  useInheritanceEditEncryptedMessageDialog,
} from './context';

const DeviceConnectionWrapper: React.FC<{
  isDeviceRequired: boolean;
  children: React.ReactNode;
  withConnectedProps?: WithConnectedDeviceProps;
}> = ({ isDeviceRequired, withConnectedProps, children }) => {
  if (isDeviceRequired)
    return (
      <WithConnectedDevice {...(withConnectedProps ?? {})}>
        {children}
      </WithConnectedDevice>
    );
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};

DeviceConnectionWrapper.defaultProps = {
  withConnectedProps: {},
};

const InheritanceEditEncryptedMessage: FC = () => {
  const {
    tabs,
    currentTab,
    currentDialog,
    unhandledError,
    onClose,
    isDeviceRequired,
  } = useInheritanceEditEncryptedMessageDialog();

  return (
    <BlurOverlay>
      <ErrorHandlerDialog
        onClose={onClose}
        error={unhandledError}
        showCloseButton
        noDelay
      >
        <DeviceConnectionWrapper isDeviceRequired={isDeviceRequired}>
          {tabs[currentTab]?.dialogs[currentDialog]}
        </DeviceConnectionWrapper>
      </ErrorHandlerDialog>
    </BlurOverlay>
  );
};

export const InheritanceEditEncryptedMessageDialog = () => (
  <InheritanceEditEncryptedMessageDialogProvider>
    <InheritanceEditEncryptedMessage />
  </InheritanceEditEncryptedMessageDialogProvider>
);
