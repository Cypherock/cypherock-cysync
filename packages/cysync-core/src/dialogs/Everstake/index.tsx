import { SignTransactionDeviceEvent } from '@cypherock/coin-support-interfaces';
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
import { EverstakeProvider, useEverstake } from '~/context/everstake';
import {
  closeDialog,
  selectDialogs,
  useAppDispatch,
  useAppSelector,
} from '~/store';

import { EverstakeConsent } from './Pages/EverstakeConsent';
import { EverstakeClaim } from './Pages/EverstakeClaim';
import { EverstakeClaimDone } from './Pages/EverstakeClaimDone';
import { EverstakeStake } from './Pages/EverstakeStake';
import { EverstakeStakeDone } from './Pages/EverstakeStakeDone';
import { EverstakeStaking } from './Pages/EverstakeStaking';
import { EverstakeUnstake } from './Pages/EverstakeUnstake';
import { EverstakeUnstakeDone } from './Pages/EverstakeUnstakeDone';

export interface EverstakeDialogProps {
  initialAccountId?: string;
  initialWalletId?: string;
  initialMode?: 'stake' | 'unstake' | 'claim';
}

const STEP_TO_MILESTONE: Record<string, number> = {
  // stake
  consent: 0,
  stakeInput: 0,
  stakeFee: 1,
  staking: 1,
  stakeDone: 3,
  // unstake
  unstakeInput: 0,
  unstakeFee: 1,
  unstaking: 1,
  unstakeDone: 3,
  // claim
  claimFee: 0,
  claimConfirm: 1,
  claiming: 1,
  claimDone: 3,
};

const DEVICE_REQUIRED_STEPS = ['staking', 'unstaking', 'claiming'];

const DeviceConnectionWrapper: React.FC<{
  isDeviceRequired: boolean;
  children: React.ReactNode;
}> = ({ isDeviceRequired, children }) => {
  if (isDeviceRequired)
    return <WithConnectedDevice>{children}</WithConnectedDevice>;
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};

const EverstakeContent: React.FC = () => {
  const { step, onClose, error, selectedWallet, mode, setMode, deviceEvents } =
    useEverstake();
  const isDeviceRequired = DEVICE_REQUIRED_STEPS.includes(step);

  const getMilestones = () => {
    if (mode === 'claim') return ['Review', 'Sign', 'Done'];
    return ['Amount', 'Sign', 'Done'];
  };

  const lastMilestoneRef = useRef(0);
  if (step !== 'error') {
    lastMilestoneRef.current = STEP_TO_MILESTONE[step] ?? 0;
  }

  const cardTapped =
    isDeviceRequired && !!deviceEvents[SignTransactionDeviceEvent.CARD_TAPPED];

  let activeTab: number;
  if (step === 'error') {
    activeTab = lastMilestoneRef.current;
  } else if (cardTapped) {
    activeTab = 2;
  } else {
    activeTab = STEP_TO_MILESTONE[step] ?? 0;
  }

  const renderContent = () => {
    switch (step) {
      case 'consent':
        return <EverstakeConsent />;
      case 'stakeInput':
      case 'stakeFee':
        return <EverstakeStake />;
      case 'staking':
        return <EverstakeStaking />;
      case 'stakeDone':
        return <EverstakeStakeDone />;
      case 'unstakeInput':
      case 'unstakeFee':
        return <EverstakeUnstake />;
      case 'unstaking':
        return <EverstakeStaking />;
      case 'unstakeDone':
        return <EverstakeUnstakeDone />;
      case 'claimFee':
      case 'claimConfirm':
        return <EverstakeClaim />;
      case 'claiming':
        return <EverstakeStaking />;
      case 'claimDone':
        return <EverstakeClaimDone />;
      case 'error':
        return null;
      default:
        return null;
    }
  };

  return (
    <BlurOverlay>
      <DialogBox
        direction="row"
        gap={0}
        width="full"
        $maxHeight="90vh"
        onClose={onClose}
      >
        <MilestoneAside
          heading="Earn"
          milestones={getMilestones()}
          activeTab={activeTab}
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
            <ErrorHandlerDialog
              error={error}
              onClose={onClose}
              onRetry={() => setMode(mode)}
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

export const EverstakePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const handleClose = () => dispatch(closeDialog('everstakeDialog'));
  const dialogs = useAppSelector(selectDialogs);
  const initialAccountId = dialogs.everstakeDialog?.data?.initialAccountId;
  const initialWalletId = dialogs.everstakeDialog?.data?.initialWalletId;
  const initialMode = dialogs.everstakeDialog?.data?.initialMode;

  return (
    <EverstakeProvider
      onClose={handleClose}
      initialAccountId={initialAccountId}
      initialWalletId={initialWalletId}
      initialMode={initialMode}
    >
      <EverstakeContent />
    </EverstakeProvider>
  );
};
