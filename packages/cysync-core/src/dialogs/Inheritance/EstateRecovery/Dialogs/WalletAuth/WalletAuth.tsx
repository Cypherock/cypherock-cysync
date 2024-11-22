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
import React, { useEffect, useState } from 'react';

import { WalletAuthLoginStep } from '~/dialogs/Inheritance/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceEstateRecoveryDialog } from '../../context';
import { Layout } from '../../Layout';

const checkIconComponent = <Check width={15} height={12} />;
const throbberComponent = <Throbber size={15} strokeWidth={2} />;
const rightArrowIcon = <ArrowRightIcon />;

export const WalletAuth = () => {
  const lang = useAppSelector(selectLanguage);

  const strings = lang.strings.dialogs.inheritanceEstateRecovery;

  const [cardTapState, setCardTapState] = useState(-1);

  const {
    onNext,
    selectedWallet,
    walletAuthDeviceEvents,
    walletAuthStep,
    walletAuthStart,
    walletAuthAbort,
    retryIndex,
    clearErrors,
    isRegisterationRequired,
  } = useInheritanceEstateRecoveryDialog();

  const getDeviceEventIcon = (
    loadingEvent: InheritanceWalletAuthDeviceEvent,
    completedEvent: InheritanceWalletAuthDeviceEvent,
  ) => {
    if (walletAuthDeviceEvents[completedEvent]) return checkIconComponent;
    if (walletAuthDeviceEvents[loadingEvent]) return throbberComponent;

    return undefined;
  };

  const actionsList = React.useMemo<LeanBoxProps[]>(() => {
    const actions: LeanBoxProps[] = [
      {
        id: '1',
        text: strings.wallet.actions.confirm,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(
          InheritanceWalletAuthDeviceEvent.INIT,
          InheritanceWalletAuthDeviceEvent.CONFIRMED,
        ),
      },
    ];

    return actions;
  }, [strings, walletAuthDeviceEvents, isRegisterationRequired]);

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
    setCardTapState(-1);

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
        $width={506}
        $height={285}
        loop
        autoPlay
      />
      <Container direction="column" mb={2}>
        <Typography $fontSize={20} $textAlign="center" color="white">
          {strings.wallet.title}
        </Typography>
        <Typography $fontSize={16} $textAlign="center" color="muted">
          <LangDisplay text={strings.wallet.subTitle} />
          <Typography variant="span" $fontWeight="bold" $fontSize={16}>
            {selectedWallet?.name}
          </Typography>
        </Typography>
      </Container>
      <LeanBoxContainer mb={2}>
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
        <CardTapList
          items={[
            {
              text: strings.wallet.actions.tapCard,
              currentState: cardTapState,
              totalState: 2,
            },
          ]}
          variant="muted"
        />
      </LeanBoxContainer>
      <MessageBox type="warning" text={strings.wallet.messageBox.warning} />
    </Layout>
  );
};
