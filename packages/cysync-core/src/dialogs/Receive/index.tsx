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
import { selectLanguage, useAppSelector } from '~/store';

import { ReceiveDialogProvider, useReceiveDialog } from './context';

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
  } = useReceiveDialog();
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
            heading={lang.strings.receive.title}
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
};
