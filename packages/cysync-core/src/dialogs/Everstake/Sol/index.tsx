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
import { SolEverstakeProvider, useSolEverstake } from '~/context/everstake/sol';
import {
  closeDialog,
  selectDialogs,
  useAppDispatch,
  useAppSelector,
} from '~/store';

import { SolActionInfo } from './Pages/SolActionInfo';
import { SolClaim } from './Pages/SolClaim';
import { SolConsent } from './Pages/SolConsent';
import { SolDone } from './Pages/SolDone';
import { SolSigning } from './Pages/SolSigning';
import { SolStake } from './Pages/SolStake';
import { SolUnstake } from './Pages/SolUnstake';

export interface EverstakeSolDialogProps {
  initialAccountId?: string;
  initialWalletId?: string;
  initialMode?: 'stake' | 'unstake' | 'claim';
}

const STAKE_STEP_TO_MILESTONE: Record<string, number> = {
  consent: 0,
  stakeInput: 0,
  stakeReview: 1,
  staking: 1,
  stakeDone: 3,
};

const UNSTAKE_STEP_TO_MILESTONE: Record<string, number> = {
  unstakeInfo: 0,
  unstakeInput: 0,
  unstakeReview: 1,
  unstaking: 1,
  unstakeDone: 3,
};

const CLAIM_STEP_TO_MILESTONE: Record<string, number> = {
  claimInfo: 0,
  claimReview: 1,
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

const SolEverstakeContent: React.FC = () => {
  const { step, onClose, error, selectedWallet, mode, setMode, deviceEvents } =
    useSolEverstake();
  const isDeviceRequired = DEVICE_REQUIRED_STEPS.includes(step);

  const getMilestones = () =>
    mode === 'claim' ? ['Review', 'Sign', 'Done'] : ['Amount', 'Sign', 'Done'];

  const getStepToMilestone = (): Record<string, number> => {
    if (mode === 'claim') return CLAIM_STEP_TO_MILESTONE;
    if (mode === 'unstake') return UNSTAKE_STEP_TO_MILESTONE;
    return STAKE_STEP_TO_MILESTONE;
  };

  const stepToMilestone = getStepToMilestone();

  const lastMilestoneRef = useRef(0);
  if (step !== 'error') {
    lastMilestoneRef.current = stepToMilestone[step] ?? 0;
  }

  const cardTapped =
    isDeviceRequired && !!deviceEvents[SignTransactionDeviceEvent.CARD_TAPPED];

  let activeTab: number;
  if (step === 'error') {
    activeTab = lastMilestoneRef.current;
  } else if (cardTapped) {
    activeTab = (stepToMilestone[step] ?? 0) + 1;
  } else {
    activeTab = stepToMilestone[step] ?? 0;
  }

  const renderContent = () => {
    switch (step) {
      case 'consent':
        return <SolConsent />;
      case 'stakeInput':
      case 'stakeReview':
        return <SolStake />;
      case 'unstakeInfo':
      case 'claimInfo':
        return <SolActionInfo />;
      case 'unstakeInput':
      case 'unstakeReview':
        return <SolUnstake />;
      case 'claimReview':
        return <SolClaim />;
      case 'staking':
      case 'unstaking':
      case 'claiming':
        return <SolSigning />;
      case 'stakeDone':
      case 'unstakeDone':
      case 'claimDone':
        return <SolDone />;
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

export const EverstakeSolPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const handleClose = () => dispatch(closeDialog('everstakeSolDialog'));
  const dialogs = useAppSelector(selectDialogs);
  const initialAccountId = dialogs.everstakeSolDialog?.data?.initialAccountId;
  const initialWalletId = dialogs.everstakeSolDialog?.data?.initialWalletId;
  const initialMode = dialogs.everstakeSolDialog?.data?.initialMode;

  return (
    <SolEverstakeProvider
      onClose={handleClose}
      initialAccountId={initialAccountId}
      initialWalletId={initialWalletId}
      initialMode={initialMode}
    >
      <SolEverstakeContent />
    </SolEverstakeProvider>
  );
};
