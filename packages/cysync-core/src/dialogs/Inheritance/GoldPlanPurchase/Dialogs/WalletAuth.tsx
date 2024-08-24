import { SignTransactionDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  ArrowRightIcon,
  Check,
  Container,
  ErrorDialog,
  LangDisplay,
  LeanBox,
  LeanBoxContainer,
  LeanBoxProps,
  tapAnyCardDeviceAnimation2DVideo,
  Throbber,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useEffect } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceGoldPlanPurchaseDialog } from '../context';
import { Layout } from '../Layout';
import ReactPlayer from 'react-player';

const checkIconComponent = <Check width={15} height={12} />;
const throbberComponent = <Throbber size={15} strokeWidth={2} />;
const rightArrowIcon = <ArrowRightIcon />;

export const WalletAuth = () => {
  const lang = useAppSelector(selectLanguage);

  const strings = lang.strings.inheritanceGoldPlanPurchase;

  const { onNext, selectedWallet, onClose, onRetry } =
    useInheritanceGoldPlanPurchaseDialog();

  const deviceEvents: Record<number, boolean | undefined> = {
    0: true,
  };

  const getDeviceEventIcon = (
    loadingEvent: SignTransactionDeviceEvent,
    completedEvent: SignTransactionDeviceEvent,
  ) => {
    if (deviceEvents[completedEvent]) return checkIconComponent;
    if (deviceEvents[loadingEvent]) return throbberComponent;

    return undefined;
  };

  const actionsList = React.useMemo<LeanBoxProps[]>(() => {
    const actions: LeanBoxProps[] = [
      {
        id: '1',
        text: strings.walletAuth.actions.confirmOnDevice,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(0, 1),
      },
      {
        id: '2',
        text: strings.walletAuth.actions.tapCard,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(0, 1),
      },
    ];

    return actions;
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onNext();
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  const error = false;

  if (error) {
    return (
      <ErrorDialog
        title={strings.walletAuth.error.title}
        subtext={strings.walletAuth.error.subtext}
        messageBoxText={strings.walletAuth.error.messageBox.warning}
        messageBoxVariant="warning"
        onSecondaryClick={onRetry}
        onPrimaryClick={onClose}
        primaryActionText={lang.strings.buttons.exit}
        secondaryActionText={lang.strings.buttons.retry}
      />
    );
  }

  return (
    <Layout>
      <Container direction="column">
        <ReactPlayer
          url={tapAnyCardDeviceAnimation2DVideo}
          width={420}
          height={236}
          loop
          playing
        />
        <Typography $fontSize={20} $textAlign="center" color="white" mb={4}>
          {strings.walletAuth.title}
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
        <Typography $fontSize={16} $textAlign="center" color="muted" mt={2}>
          <LangDisplay text={strings.walletAuth.footer} />
          <Typography variant="span" $fontWeight="bold" $fontSize={16}>
            {selectedWallet?.name}
          </Typography>
        </Typography>
      </Container>
    </Layout>
  );
};
