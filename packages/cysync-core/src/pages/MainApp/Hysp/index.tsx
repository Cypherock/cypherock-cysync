import {
  BlurOverlay,
  CloseButton,
  DialogBox,
  DialogBoxBackgroundBar,
  DialogBoxBody,
  MilestoneAside,
  WalletDialogMainContainer,
} from '@cypherock/cysync-ui';
import React, { useRef } from 'react';

import { ErrorHandlerDialog, WithConnectedDevice } from '~/components';
import { HyspProvider, useHysp } from '~/context/hysp';
import { closeDialog, selectDialogs, useAppDispatch, useAppSelector } from '~/store';

import { HyspConsent } from './Pages/HyspConsent';
import { HyspDeposit } from './Pages/HyspDeposit';
import { HyspRedeem } from './Pages/HyspRedeem';
import { HyspStatus } from './Pages/HyspStatus';

// Which milestone index (0-based) each step belongs to
const STEP_TO_MILESTONE: Record<string, number> = {
  consent: 0,
  input: 0,
  approveFee: 1,
  approving: 1,
  polling: 1,
  depositFee: 2,
  depositing: 2,
  done: 3,
};

const DeviceConnectionWrapper: React.FC<{
  isDeviceRequired: boolean;
  children: React.ReactNode;
}> = ({ isDeviceRequired, children }) => {
  if (isDeviceRequired)
    return <WithConnectedDevice>{children}</WithConnectedDevice>;
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};

const DEVICE_REQUIRED_STEPS = ['approveFee', 'approving', 'polling', 'depositFee', 'depositing'];

const HyspContent: React.FC = () => {
  const { step, onClose, error, selectedWallet, mode, setMode } = useHysp();
  const isDeviceRequired = DEVICE_REQUIRED_STEPS.includes(step);

  const milestones = ['Stake', 'Approve', 'Deposit', 'Confirmation'];

  // Keep the last non-error milestone so sidebar stays correct on error
  const lastMilestoneRef = useRef(0);
  if (step !== 'error') {
    lastMilestoneRef.current = STEP_TO_MILESTONE[step] ?? 0;
  }
  const activeTab = step === 'error' ? lastMilestoneRef.current : (STEP_TO_MILESTONE[step] ?? 0);

  const renderContent = () => {
    switch (step) {
      case 'consent':
        return <HyspConsent />;
      case 'input':
      case 'approveFee':
      case 'depositFee':
        return <HyspDeposit />;
      case 'approving':
      case 'polling':
      case 'depositing':
      case 'done':
        return <HyspStatus />;
      case 'error':
        // Let ErrorHandlerDialog handle the error display entirely
        return null;
      // Redeem steps still handled by redeem page
      default:
        return <HyspRedeem />;
    }
  };

  return (
    <BlurOverlay>
      <DialogBox direction="row" gap={0} width="full" $maxHeight="90vh" onClose={onClose}>
        <MilestoneAside
          heading="Stake"
          milestones={milestones}
          activeTab={activeTab}
        />
        <WalletDialogMainContainer>
          <DialogBoxBody p="20" grow={2} align="center" gap={110} direction="column" height="full">
            <ErrorHandlerDialog
              error={error}
              onClose={onClose}
              onRetry={() => setMode(mode === 'deposit' ? 'deposit' : 'redeem')}
              selectedWallet={selectedWallet}
            >
              <DeviceConnectionWrapper isDeviceRequired={isDeviceRequired}>
                {renderContent()}
              </DeviceConnectionWrapper>
            </ErrorHandlerDialog>
          </DialogBoxBody>
          <DialogBoxBackgroundBar
            rightComponent={<CloseButton onClick={onClose} />}
            position="top"
            useLightPadding
          />
        </WalletDialogMainContainer>
      </DialogBox>
    </BlurOverlay>
  );
};

export const HyspPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const handleClose = () => dispatch(closeDialog('hyspDialog'));
  const dialogs = useAppSelector(selectDialogs);
  const initialAccountId = dialogs.hyspDialog?.data?.initialAccountId;
  const initialToken = dialogs.hyspDialog?.data?.initialToken;
  const initialWalletId = dialogs.hyspDialog?.data?.initialWalletId;

  return (
    <HyspProvider onClose={handleClose} initialAccountId={initialAccountId} initialToken={initialToken} initialWalletId={initialWalletId}>
      <HyspContent />
    </HyspProvider>
  );
};
