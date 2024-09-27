import {
  BlurOverlay,
  CloseButton,
  DialogBox,
  DialogBoxBackgroundBar,
  DialogBoxBody,
  MilestoneAside,
  WalletDialogMainContainer,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import {
  ErrorHandlerDialog,
  WithConnectedDevice,
  WithConnectedDeviceProps,
} from '~/components';
import { useAppSelector, selectLanguage } from '~/store';

import {
  InheritanceEstateRecoveryDialogProps,
  InheritanceEstateRecoveryDialogProvider,
  useInheritanceEstateRecoveryDialog,
} from './context';

export { type InheritanceEstateRecoveryDialogProps } from './context';

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

const InheritanceEstateRecovery: FC = () => {
  const {
    tabs,
    currentTab,
    currentDialog,
    unhandledError,
    onClose,
    isDeviceRequired,
  } = useInheritanceEstateRecoveryDialog();

  const lang = useAppSelector(selectLanguage);

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
            heading={lang.strings.dialogs.inheritanceEstateRecovery.title}
          />
          <WalletDialogMainContainer>
            <DialogBoxBody
              p="20"
              grow={2}
              align="center"
              gap={110}
              direction="column"
              height="full"
            >
              <DeviceConnectionWrapper isDeviceRequired={isDeviceRequired}>
                <ErrorHandlerDialog error={unhandledError} onClose={onClose}>
                  {tabs[currentTab]?.dialogs[currentDialog]}
                </ErrorHandlerDialog>
              </DeviceConnectionWrapper>
            </DialogBoxBody>
            <DialogBoxBackgroundBar
              rightComponent={<CloseButton onClick={() => onClose()} />}
              position="top"
              useLightPadding
            />
          </WalletDialogMainContainer>
        </>
      </DialogBox>
    </BlurOverlay>
  );
};

export const InheritanceEstateRecoveryDialog: React.FC<
  InheritanceEstateRecoveryDialogProps
> = props => (
  <InheritanceEstateRecoveryDialogProvider {...props}>
    <InheritanceEstateRecovery />
  </InheritanceEstateRecoveryDialogProvider>
);
