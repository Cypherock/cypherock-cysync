import { InheritanceWalletAuthDeviceEvent } from '@cypherock/app-support-inheritance';
import {
  ArrowRightIcon,
  CardTapList,
  Check,
  Container,
  LangDisplay,
  LeanBox,
  LeanBoxContainer,
  LeanBoxProps,
  MessageBox,
  tapAnyCardDeviceAnimation2DVideo,
  Throbber,
  Typography,
  Video,
} from '@cypherock/cysync-ui';
import React, { useEffect, useMemo, useState } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { WalletAuthLoginStep } from '../../../hooks';
import { useInheritancePinRecoveryDialog } from '../../context';
import { Layout } from '../../Layout';

const checkIconComponent = <Check width={15} height={12} />;
const throbberComponent = <Throbber size={15} strokeWidth={2} />;
const rightArrowIcon = <ArrowRightIcon />;
export const WalletAuth = () => {
  const lang = useAppSelector(selectLanguage);

  const strings = lang.strings.dialogs.inheritancePinRecovery.sync;

  const {
    onNext,
    selectedWallet,
    walletAuthDeviceEvents,
    walletAuthStep,
    walletAuthStart,
    walletAuthAbort,
    retryIndex,
    clearErrors,
  } = useInheritancePinRecoveryDialog();

  const [cardTapState, setCardTapState] = useState(-1);

  const getDeviceEventIcon = (
    loadingEvent: InheritanceWalletAuthDeviceEvent,
    completedEvent: InheritanceWalletAuthDeviceEvent,
  ) => {
    if (walletAuthDeviceEvents[completedEvent]) return checkIconComponent;
    if (walletAuthDeviceEvents[loadingEvent]) return throbberComponent;

    return undefined;
  };

  const actionsList = useMemo<LeanBoxProps[]>(() => {
    const actions: LeanBoxProps[] = [
      {
        id: '1',
        text: strings.walletAuth.actions.confirmAuth,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(
          InheritanceWalletAuthDeviceEvent.INIT,
          InheritanceWalletAuthDeviceEvent.CONFIRMED,
        ),
      },
    ];

    return actions;
  }, [strings, walletAuthDeviceEvents]);

  useEffect(() => {
    const eventToState: Record<number, number | undefined> = {
      [InheritanceWalletAuthDeviceEvent.CONFIRMED]: 0,
      [InheritanceWalletAuthDeviceEvent.CARD_PAIRING_CARD_TAPPED]: 1,
      [InheritanceWalletAuthDeviceEvent.WALLET_BASED_CARD_TAPPED]: 2,
    };

    let state: number | undefined;
    for (const event in eventToState) {
      if (walletAuthDeviceEvents[event] && eventToState[event] !== undefined) {
        state = eventToState[event]!;
      }
    }

    if (state !== undefined) {
      setCardTapState(state);
    }
  }, [walletAuthDeviceEvents]);

  useEffect(() => {
    clearErrors();
    walletAuthStart();

    return () => {
      walletAuthAbort();
    };
  }, [retryIndex, clearErrors]);

  useEffect(() => {
    if (walletAuthStep > WalletAuthLoginStep.walletAuth) {
      onNext();
    }
  }, [walletAuthStep]);

  return (
    <Layout>
      <Video
        src={tapAnyCardDeviceAnimation2DVideo}
        loop
        autoPlay
        $width={420}
        $height={236}
      />
      <Container direction="column">
        <Typography $fontSize={20} $textAlign="center" color="white">
          {strings.walletAuth.title}
        </Typography>
        <Typography $fontSize={16} $textAlign="center" color="muted" mb={6}>
          <LangDisplay text={strings.walletAuth.subTitle} />
          <Typography variant="span" $fontWeight="bold" $fontSize={16}>
            {selectedWallet}
          </Typography>
        </Typography>
        <LeanBoxContainer>
          {actionsList.map(data => (
            <LeanBox
              key={data.id}
              leftImage={data.leftImage}
              rightImage={data.rightImage}
              text={data.text}
              image={data.image}
              altText={data.altText}
              id={data.id}
            />
          ))}
        </LeanBoxContainer>
        <Container mb={4} width="full">
          <CardTapList
            items={[
              {
                text: strings.walletAuth.actions.tapCard,
                currentState: cardTapState,
                totalState: 2,
              },
            ]}
            variant="muted"
          />
        </Container>
        <MessageBox
          type="warning"
          text={strings.walletAuth.messageBox.warning}
        />
      </Container>
    </Layout>
  );
};
