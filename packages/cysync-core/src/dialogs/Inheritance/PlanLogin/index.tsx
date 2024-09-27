import { BlurOverlay } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import {
  ErrorHandlerDialog,
  WithConnectedDevice,
  WithConnectedDeviceProps,
} from '~/components';

import {
  InheritancePlanLoginDialogProvider,
  useInheritancePlanLoginDialog,
} from './context';
import { InheritancePlanLoginDialogProps } from './context/types';

export * from './context/types';

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

const InheritancePlanLogin: FC = () => {
  const {
    tabs,
    currentTab,
    currentDialog,
    unhandledError,
    onClose,
    onRetry,
    isDeviceRequired,
  } = useInheritancePlanLoginDialog();

  return (
    <BlurOverlay>
      <DeviceConnectionWrapper
        isDeviceRequired={isDeviceRequired}
        withConnectedProps={{
          onClose,
        }}
      >
        <ErrorHandlerDialog
          onClose={onClose}
          onRetry={onRetry}
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

export const InheritancePlanLoginDialog: React.FC<
  InheritancePlanLoginDialogProps
> = props => (
  <InheritancePlanLoginDialogProvider {...props}>
    <InheritancePlanLogin />
  </InheritancePlanLoginDialogProvider>
);
