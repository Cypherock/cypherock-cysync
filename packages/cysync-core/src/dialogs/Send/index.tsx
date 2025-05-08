import {
  DialogBox,
  DialogBoxBody,
  WalletDialogMainContainer,
  MilestoneAside,
  CloseButton,
  BlurOverlay,
  DialogBoxBackgroundBar,
} from '@cypherock/cysync-ui';
import React, { FC, useEffect, useState } from 'react';

import { ErrorHandlerDialog, WithConnectedDevice } from '~/components';
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
    validTill,
  } = useSendDialog();
  const getTotalSeconds = () => {
    if (!validTill) return 0;
    const diff = new Date(validTill).getTime() - Date.now();
    return Math.max(0, Math.floor(diff / 1000));
  };

  const [seconds, setSeconds] = useState(getTotalSeconds());

  useEffect(() => {
    setSeconds(getTotalSeconds());
  }, [validTill]);

  useEffect(() => {
    const interval = setInterval(
      () => setSeconds(s => Math.max(s - 1, 0)),
      1000,
    );
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

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
              source === SendFlowSource.SWAP && validTill
                ? {
                    title: lang.strings.send.aside.timer.title,
                    minutesLabel: lang.strings.send.aside.timer.minutes,
                    minutes: minutes.toString().padStart(2, '0'),
                    seconds: remainingSeconds.toString().padStart(2, '0'),
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

export const SendDialog: FC<SendDialogProps> = props => (
  <SendDialogProvider {...props}>
    <SendFlow />
  </SendDialogProvider>
);
