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

import { SendDialogProvider, useSendDialog } from './context';

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
  } = useSendDialog();
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
            heading={lang.strings.send.aside.tabs.heading}
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
                >
                  {tabs[currentTab]?.dialogs[currentDialog]}
                </ErrorHandlerDialog>
              </DeviceConnectionWrapper>
            </DialogBoxBody>
            <DialogBoxBackgroundBar
              rightComponent={
                <CloseButton onClick={() => setShowOnClose(true)} />
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

export const SendDialog: FC = () => (
  <SendDialogProvider>
    <SendFlow />
  </SendDialogProvider>
);
