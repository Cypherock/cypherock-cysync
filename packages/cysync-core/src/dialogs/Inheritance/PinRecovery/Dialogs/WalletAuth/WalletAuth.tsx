import { InheritanceWalletAuthDeviceEvent } from '@cypherock/app-support-inheritance';
import {
  ArrowRightIcon,
  Check,
  Container,
  LangDisplay,
  LeanBox,
  LeanBoxContainer,
  LeanBoxProps,
  tapAnyCardDeviceAnimation2DVideo,
  Throbber,
  Typography,
  Video,
} from '@cypherock/cysync-ui';
import React, { useEffect, useMemo } from 'react';

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
      {
        id: '2',
        text: strings.walletAuth.actions.enterPinAndTapCard,
        rightImage: getDeviceEventIcon(
          InheritanceWalletAuthDeviceEvent.CONFIRMED,
          InheritanceWalletAuthDeviceEvent.WALLET_BASED_CARD_TAPPED,
        ),
      },
    ];

    return actions;
  }, [strings, walletAuthDeviceEvents]);

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
            {selectedWallet?.name}
          </Typography>
        </Typography>
        <LeanBoxContainer mb={4}>
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
      </Container>
    </Layout>
  );
};
