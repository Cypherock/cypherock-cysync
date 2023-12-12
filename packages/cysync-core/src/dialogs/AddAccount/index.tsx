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

import { AddAccountDialogProvider, useAddAccountDialog } from './context';

export interface AddAccountDialogProps {
  walletId?: string;
  coinId?: string;
}

const AddNewAccount: FC = () => {
  const {
    tabs,
    currentTab,
    currentDialog,
    onClose,
    isDeviceRequired,
    error,
    onRetry,
    selectedWallet,
  } = useAddAccountDialog();

  const WrapperComponent = isDeviceRequired
    ? WithConnectedDevice
    : React.Fragment;
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
            heading={lang.strings.addAccount.header}
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
              <WrapperComponent>
                <ErrorHandlerDialog
                  error={error}
                  onClose={onClose}
                  onRetry={onRetry}
                  selectedWallet={selectedWallet}
                >
                  {tabs[currentTab]?.dialogs[currentDialog]}
                </ErrorHandlerDialog>
              </WrapperComponent>
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

export const AddAccountDialog: FC<AddAccountDialogProps> = props => (
  <AddAccountDialogProvider {...props}>
    <AddNewAccount />
  </AddAccountDialogProvider>
);

AddAccountDialog.defaultProps = {
  coinId: undefined,
  walletId: undefined,
};
