import { SignTransactionDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  ArrowRightIcon,
  Button,
  Check,
  Container,
  Flex,
  LeanBox,
  LeanBoxContainer,
  LeanBoxProps,
  Throbber,
  Typography,
  VerifyAmountDeviceGraphics,
} from '@cypherock/cysync-ui';
import React, { useMemo } from 'react';

import { useHysp } from '~/context/hysp';

const checkIcon = <Check width={15} height={12} />;
const throbberIcon = <Throbber size={15} strokeWidth={2} />;
const arrowIcon = <ArrowRightIcon />;

export const HyspStatus: React.FC = () => {
  const { step, error, deviceEvents, redeemPath, onClose } = useHysp();

  const isDeviceSigning = [
    'approving',
    'depositing',
    'redeem-approving',
    'redeeming',
  ].includes(step);

  const isPolling = step === 'polling' || step === 'redeem-polling';
  const isDone = step === 'done';
  const isRedeemDone = step === 'redeem-done';
  const isError = step === 'error';

  const getEventIcon = (
    loadingEvent: SignTransactionDeviceEvent,
    completedEvent: SignTransactionDeviceEvent,
  ) => {
    if (deviceEvents[completedEvent]) return checkIcon;
    if (deviceEvents[loadingEvent]) return throbberIcon;
    return undefined;
  };

  const deviceSteps = useMemo<LeanBoxProps[]>(
    () => [
      {
        id: '1',
        text: 'Confirm on X1 Vault',
        leftImage: arrowIcon,
        rightImage: getEventIcon(
          SignTransactionDeviceEvent.INIT,
          SignTransactionDeviceEvent.CONFIRMED,
        ),
      },
      {
        id: '2',
        text: 'Verify transaction details',
        leftImage: arrowIcon,
        rightImage: getEventIcon(
          SignTransactionDeviceEvent.CONFIRMED,
          SignTransactionDeviceEvent.VERIFIED,
        ),
      },
      {
        id: '3',
        text: 'Tap any card',
        leftImage: arrowIcon,
        rightImage: getEventIcon(
          SignTransactionDeviceEvent.VERIFIED,
          SignTransactionDeviceEvent.CARD_TAPPED,
        ),
      },
    ],
    [deviceEvents],
  );

  const getTitle = () => {
    if (step === 'approving' || step === 'redeem-approving')
      return 'Approve on Device';
    if (step === 'depositing') return 'Confirm Deposit on Device';
    if (step === 'redeeming') return 'Confirm Redeem on Device';
    if (isPolling) return 'Waiting for Approval...';
    if (isDone) return 'Deposit Successful!';
    if (isRedeemDone)
      return redeemPath === 'queue'
        ? 'Redeem Request Submitted'
        : 'Redeem Successful!';
    if (isError) return 'Something Went Wrong';
    return '';
  };

  const getDescription = () => {
    if (step === 'approving' || step === 'redeem-approving')
      return 'Review and confirm the approval on your Cypherock X1.';
    if (step === 'depositing')
      return 'Review and confirm the deposit on your Cypherock X1.';
    if (step === 'redeeming')
      return 'Review and confirm the redemption on your Cypherock X1.';
    if (isPolling)
      return 'Your approval is being confirmed on-chain. This may take a few seconds.';
    if (isDone)
      return 'Your USDC has been deposited into the HYSP vault successfully.';
    if (isRedeemDone && redeemPath === 'queue')
      return 'Your redeem request has been submitted. Funds will be available within 3 business days.';
    if (isRedeemDone) return 'Your mevUSD has been redeemed successfully.';
    if (isError) return error ?? 'An unknown error occurred.';
    return '';
  };

  return (
    <Container display="flex" direction="column" gap={24} p={5} width="full">
      {isDeviceSigning && (
        <>
          <VerifyAmountDeviceGraphics />
          <LeanBoxContainer>
            {deviceSteps.map(s => (
              <LeanBox
                key={s.id}
                id={s.id}
                text={s.text}
                leftImage={s.leftImage}
                rightImage={s.rightImage}
              />
            ))}
          </LeanBoxContainer>
        </>
      )}

      <Flex direction="column" gap={12} align="center">
        <Typography variant="h5" $textAlign="center">
          {getTitle()}
        </Typography>
        <Typography variant="p" color="muted" $textAlign="center">
          {getDescription()}
        </Typography>
      </Flex>

      {(isDone || isRedeemDone || isError) && (
        <Button onClick={onClose} variant={isError ? 'danger' : 'primary'}>
          {isError ? 'Close' : 'Done'}
        </Button>
      )}
    </Container>
  );
};
