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
  ReceiveDialogProvider,
  ReceiveFlowSource,
  useReceiveDialog,
} from './context';

const DeviceConnectionWrapper: React.FC<{
  isDeviceRequired: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ isDeviceRequired, label, onClick, children }) => {
  if (isDeviceRequired)
    return (
      <WithConnectedDevice buttonLabel={label} buttonOnClick={onClick}>
        {children}
      </WithConnectedDevice>
    );
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};

export interface ReceiveDialogProps {
  walletId?: string;
  accountId?: string;
  skipSelection?: boolean;
  storeReceiveAddress?: (address: string) => void;
  onClose?: () => void;
  source?: ReceiveFlowSource;
  onError?: (e?: any) => void;
  validTill?: number;
}

export const Receive: FC = () => {
  const {
    tabs,
    currentTab,
    currentDialog,
    onClose,
    isDeviceRequired,
    error,
    onRetry,
    onSkip,
    isStartedWithoutDevice,
    selectedWallet,
    isAddressVerified,
    source,
    validTill,
  } = useReceiveDialog();
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
      <DialogBox direction="row" gap={0} width="full" onClose={onClose}>
        <>
          <MilestoneAside
            milestones={tabs
              .filter(t => !t.dontShowOnMilestone)
              .map(t => t.name)}
            activeTab={currentTab}
            skippedTabs={!isAddressVerified && currentTab > 2 ? [1] : []}
            heading={
              source === ReceiveFlowSource.SWAP
                ? lang.strings.swap.title
                : lang.strings.receive.title
            }
            timer={
              source === ReceiveFlowSource.SWAP && validTill
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
              <DeviceConnectionWrapper
                isDeviceRequired={!isStartedWithoutDevice && isDeviceRequired}
                label={lang.strings.receive.showAnywayButton}
                onClick={onSkip}
              >
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

export const ReceiveDialog: FC<ReceiveDialogProps> = props => (
  <ReceiveDialogProvider {...props}>
    <Receive />
  </ReceiveDialogProvider>
);

ReceiveDialog.defaultProps = {
  walletId: undefined,
  accountId: undefined,
  skipSelection: undefined,
  storeReceiveAddress: undefined,
  onClose: undefined,
  source: ReceiveFlowSource.DEFAULT,
  onError: undefined,
  validTill: undefined,
};
