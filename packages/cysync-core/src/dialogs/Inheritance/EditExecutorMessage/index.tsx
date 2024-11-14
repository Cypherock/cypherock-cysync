import { BlurOverlay } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import {
  ErrorHandlerDialog,
  WithConnectedDevice,
  WithConnectedDeviceProps,
} from '~/components';

import {
  InheritanceEditExecutorMessageDialogProps,
  InheritanceEditExecutorMessageDialogProvider,
  useInheritanceEditExecutorMessageDialog,
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

const InheritanceEditExecutorMessage: FC = () => {
  const {
    tabs,
    currentTab,
    currentDialog,
    unhandledError,
    onClose,
    isDeviceRequired,
  } = useInheritanceEditExecutorMessageDialog();

  return (
    <BlurOverlay>
      <DeviceConnectionWrapper isDeviceRequired={isDeviceRequired}>
        <ErrorHandlerDialog
          onClose={onClose}
          error={unhandledError}
          showCloseButton
          noDelay
        >
          {tabs[currentTab]?.dialogs[currentDialog]}
        </ErrorHandlerDialog>
      </DeviceConnectionWrapper>
    </BlurOverlay>
  );
};

export const InheritanceEditExecutorMessageDialog: FC<
  InheritanceEditExecutorMessageDialogProps
> = props => (
  <InheritanceEditExecutorMessageDialogProvider {...props}>
    <InheritanceEditExecutorMessage />
  </InheritanceEditExecutorMessageDialogProvider>
);
