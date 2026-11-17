import {
  DialogBox,
  DialogBoxBody,
  WalletDialogMainContainer,
  MilestoneAside,
  CloseButton,
  BlurOverlay,
  DialogBoxBackgroundBar,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { ErrorHandlerDialog, WithConnectedDevice } from '~/components';
import { analyticsService, ANALYTICS_EVENTS } from '~/services/analytics';
import { selectLanguage, useAppSelector } from '~/store';

import {
  SendDialogProps,
  SendDialogProvider,
  SendFlowSource,
  useSendDialog,
} from './context';

export type { SendDialogProps } from './context';

const DeviceConnectionWrapper: React.FC<{
  isDeviceRequired: boolean;
  children: React.ReactNode;
}> = ({ isDeviceRequired, children }) => {
  if (isDeviceRequired)
    return <WithConnectedDevice>{children}</WithConnectedDevice>;
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};

export const SendFlow: FC = () => {
  const {
    tabs,
    currentTab,
    currentDialog,
    onClose,
    isDeviceRequired,
    error,
    onRetry,
    selectedWallet,
    source,
    timer,
  } = useSendDialog();

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
            heading={
              source === SendFlowSource.SWAP
                ? lang.strings.swap.title
                : lang.strings.send.title
            }
            timer={
              timer
                ? {
                    title: lang.strings.send.aside.timer.title,
                    minutesLabel: lang.strings.send.aside.timer.minutes,
                    minutes: timer.minutes,
                    seconds: timer.seconds,
                    secondsLabel: lang.strings.send.aside.timer.seconds,
                  }
                : undefined
            }
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
                  error={error}
                  onClose={onClose}
                  onRetry={onRetry}
                  selectedWallet={selectedWallet}
                >
                  {tabs[currentTab]?.dialogs[currentDialog]}
                </ErrorHandlerDialog>
              </DeviceConnectionWrapper>
            </DialogBoxBody>
            <DialogBoxBackgroundBar
              rightComponent={
                <CloseButton
                  onClick={() => {
                    analyticsService.trackEvent(
                      ANALYTICS_EVENTS.SEND_CANCELLED,
                      {
                        source:
                          source === SendFlowSource.SWAP ? 'swap' : 'default',
                        action: 'dialog_closed',
                      },
                    );
                    onClose();
                  }}
                />
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

export const SendDialog: FC<SendDialogProps> = props => (
  <SendDialogProvider {...props}>
    <SendFlow />
  </SendDialogProvider>
);
