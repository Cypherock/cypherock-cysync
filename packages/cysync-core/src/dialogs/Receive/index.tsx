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

import {
  CloseConfirmationDialog,
  ErrorHandlerDialog,
  WithConnectedDevice,
} from '~/components';
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
  } = useReceiveDialog();
  const lang = useAppSelector(selectLanguage);
  const [showOnClose, setShowOnClose] = React.useState(false);

  return (
    <BlurOverlay>
      <DialogBox direction="row" gap={0} width="full">
        <CloseConfirmationDialog
          isDialogVisible={showOnClose}
          setIsDialogVisible={setShowOnClose}
          onClose={onClose}
        />
        <>
          <MilestoneAside
            milestones={tabs
              .filter(t => !t.dontShowOnMilestone)
              .map(t => t.name)}
            activeTab={currentTab}
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
              rightComponent={
                // do not display confirmation dialog on closing when on the first tab
                <CloseButton
                  onClick={() =>
                    currentTab === 0 ? onClose() : setShowOnClose(true)
                  }
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

export const ReceiveDialog: FC<ReceiveDialogProps> = props => (
  <ReceiveDialogProvider {...props}>
    <Receive />
  </ReceiveDialogProvider>
);

ReceiveDialog.defaultProps = {
  walletId: undefined,
  accountId: undefined,
};
