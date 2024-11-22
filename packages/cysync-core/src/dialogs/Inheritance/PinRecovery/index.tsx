import {
  BlurOverlay,
  CloseButton,
  DialogBox,
  DialogBoxBackgroundBar,
  DialogBoxBody,
  HelpButton,
  MilestoneAside,
  WalletDialogMainContainer,
} from '@cypherock/cysync-ui';
import React, { FC, useEffect } from 'react';

import {
  ErrorHandlerDialog,
  WithConnectedDevice,
  WithConnectedDeviceProps,
} from '~/components';
import { selectLanguage, useAppSelector } from '~/store';

import {
  InheritancePinRecoveryDialogProps,
  InheritancePinRecoveryDialogProvider,
  useInheritancePinRecoveryDialog,
} from './context';

export type { InheritancePinRecoveryDialogProps } from './context';

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
    onHelp,
    isDeviceRequired,
    onRetry,
    decryptPinAbort,
  } = useInheritancePinRecoveryDialog();

  useEffect(() => decryptPinAbort, []);

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
                <ErrorHandlerDialog
                  onClose={onClose}
                  error={unhandledError}
                  onRetry={onRetry}
                  noDelay={!isDeviceRequired}
                >
                  {tabs[currentTab]?.dialogs[currentDialog]}
                </ErrorHandlerDialog>
              </DeviceConnectionWrapper>
            </DialogBoxBody>
            <DialogBoxBackgroundBar
              rightComponent={<CloseButton onClick={() => onClose()} />}
              leftComponent={
                <HelpButton text={lang.strings.help} onClick={onHelp} />
              }
              position="top"
              useLightPadding
            />
          </WalletDialogMainContainer>
        </>
      </DialogBox>
    </BlurOverlay>
  );
};

export const InheritancePinRecoveryDialog: React.FC<
  InheritancePinRecoveryDialogProps
> = props => (
  <InheritancePinRecoveryDialogProvider {...props}>
    <InheritancePinRecovery />
  </InheritancePinRecoveryDialogProvider>
);
