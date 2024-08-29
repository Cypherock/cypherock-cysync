import {
  BlurOverlay,
  DialogBox,
  DialogBoxBody,
  MilestoneAside,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import {
  ErrorHandlerDialog,
  WithConnectedDevice,
  WithConnectedDeviceProps,
} from '~/components';

import {
  InheritancePinRecoveryDialogProvider,
  useInheritancePinRecoveryDialog,
} from './context';
import { selectLanguage, useAppSelector } from '~/store';

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

const InheritancePinRecovery: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const {
    tabs,
    currentTab,
    currentDialog,
    unhandledError,
    onClose,
    isDeviceRequired,
  } = useInheritancePinRecoveryDialog();

  return (
    <BlurOverlay>
      <DialogBox
        direction="row"
        gap={0}
        width="full"
        $maxHeight="90vh"
        onClose={onClose}
      >
        <>
          <MilestoneAside
            milestones={tabs
              .filter(t => !t.dontShowOnMilestone)
              .map(t => t.name)}
            activeTab={currentTab}
            heading={lang.strings.dialogs.inheritancePinRecovery.title}
          />
          <DialogBoxBody
            p="20"
            grow={2}
            align="center"
            gap={110}
            direction="column"
            height="full"
          >
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
          </DialogBoxBody>
        </>
      </DialogBox>
    </BlurOverlay>
  );
};

export const InheritancePinRecoveryDialog = () => (
  <InheritancePinRecoveryDialogProvider>
    <InheritancePinRecovery />
  </InheritancePinRecoveryDialogProvider>
);
