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

import { selectLanguage, useAppSelector } from '~/store';

import { WalletAuthLoginStep } from '../../../hooks';
import { useInheritanceSilverPlanPurchaseDialog } from '../../context';
import { Layout } from '../../Layout';

const checkIconComponent = <Check width={15} height={12} />;
const throbberComponent = <Throbber size={15} strokeWidth={2} />;
const rightArrowIcon = <ArrowRightIcon />;

export const WalletAuth = () => {
  const lang = useAppSelector(selectLanguage);

  const strings = lang.strings.inheritanceSilverPlanPurchase;
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
  } = useInheritanceSilverPlanPurchaseDialog();

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
        text: strings.wallet.walletAuth.actions.confirm,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(
          InheritanceWalletAuthDeviceEvent.INIT,
          InheritanceWalletAuthDeviceEvent.CONFIRMED,
        ),
      },
    ];

    if (!isRegisterationRequired) {
      actions.push({
        id: '2',
        text: strings.wallet.walletAuth.actions.tapCard,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(
          InheritanceWalletAuthDeviceEvent.CONFIRMED,
          InheritanceWalletAuthDeviceEvent.WALLET_BASED_CARD_TAPPED,
        ),
      });
    }

    return actions;
  }, [strings, walletAuthDeviceEvents, isRegisterationRequired]);

  useEffect(() => {
    const eventToState: Record<number, number | undefined> = {
      [InheritanceWalletAuthDeviceEvent.CONFIRMED]: 0,
      [InheritanceWalletAuthDeviceEvent.SEED_BASED_CARD_TAPPED]: 1,
      [InheritanceWalletAuthDeviceEvent.CARD_PAIRING_CARD_TAPPED]: 2,
      [InheritanceWalletAuthDeviceEvent.WALLET_BASED_CARD_TAPPED]: 3,
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
      <Container direction="column">
        <Video
          src={tapAnyCardDeviceAnimation2DVideo}
          autoPlay
          loop
          $width={506}
          $height={285}
        />
        <Container direction="column" gap={4} mb={4}>
          <Typography $fontSize={20} $textAlign="center" color="white">
            {strings.wallet.walletAuth.title}
          </Typography>
          <Typography $fontSize={16} $textAlign="center" color="muted">
            <LangDisplay text={strings.wallet.walletAuth.subTitle} />
            <Typography variant="span" $fontSize={16}>
              {selectedWallet?.name}
            </Typography>
          </Typography>
        </Container>
        <LeanBoxContainer mb={6}>
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
          {isRegisterationRequired && (
            <CardTapList
              items={[
                {
                  text: strings.wallet.walletAuth.actions.tapCard,
                  currentState: cardTapState,
                  totalState: 3,
                },
              ]}
              variant="muted"
            />
          )}
        </LeanBoxContainer>
        {isRegisterationRequired && (
          <MessageBox
            type="warning"
            text={strings.wallet.walletAuth.messageBox.warning}
          />
        )}
      </Container>
    </Layout>
  );
};
