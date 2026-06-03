import {
  BlurOverlay,
  Button,
  CloseButton,
  Container,
  DialogBox,
  DialogBoxBody,
  Flex,
} from '@cypherock/cysync-ui';
import React from 'react';

import { HyspProvider, useHysp } from '~/context/hysp';
import { closeDialog, useAppDispatch } from '~/store';

import { HyspDeposit } from './Pages/HyspDeposit';
import { HyspRedeem } from './Pages/HyspRedeem';
import { HyspStatus } from './Pages/HyspStatus';
import { HyspVaultInfo } from './Pages/HyspVaultInfo';

const STATUS_STEPS = new Set([
  'approving',
  'polling',
  'depositing',
  'done',
  'redeem-approving',
  'redeem-polling',
  'redeeming',
  'redeem-done',
  'error',
]);

const HyspContent: React.FC = () => {
  const { step, mode, setMode, onClose } = useHysp();

  const isStatusStep = STATUS_STEPS.has(step);

  const showRightPanel = () => {
    if (isStatusStep) return <HyspStatus />;
    if (mode === 'redeem') return <HyspRedeem />;
    return <HyspDeposit />;
  };

  return (
    <BlurOverlay>
      <DialogBox width={900}>
        <CloseButton onClick={onClose} />
        <DialogBoxBody>
          <Container display="flex" direction="row" width="full">
            {/* Left panel — vault info */}
            <Container $flex={1} p={4}>
              <HyspVaultInfo />
            </Container>

            {/* Right panel — deposit / redeem / status */}
            <Container $flex={1} p={4} direction="column" display="flex">
              {/* Mode toggle — only shown on input steps */}
              {!isStatusStep && (
                <Flex gap={8} mb={4}>
                  <Button
                    variant={mode === 'deposit' ? 'primary' : 'secondary'}
                    onClick={() => setMode('deposit')}
                  >
                    Deposit
                  </Button>
                  <Button
                    variant={mode === 'redeem' ? 'primary' : 'secondary'}
                    onClick={() => setMode('redeem')}
                  >
                    Redeem
                  </Button>
                </Flex>
              )}

              {showRightPanel()}
            </Container>
          </Container>
        </DialogBoxBody>
      </DialogBox>
    </BlurOverlay>
  );
};

export const HyspPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const handleClose = () => dispatch(closeDialog('hyspDialog'));

  return (
    <HyspProvider onClose={handleClose}>
      <HyspContent />
    </HyspProvider>
  );
};
