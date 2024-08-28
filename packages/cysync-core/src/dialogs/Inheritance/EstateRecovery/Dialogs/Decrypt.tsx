import { SignTransactionDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  ArrowRightIcon,
  Check,
  Container,
  ErrorDialog,
  LeanBox,
  LeanBoxContainer,
  LeanBoxProps,
  MessageBox,
  tapAnyCardDeviceAnimation2DVideo,
  Throbber,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useEffect } from 'react';
import ReactPlayer from 'react-player';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceEstateRecoveryDialog } from '../context';
import { Layout } from '../Layout';

const checkIconComponent = <Check width={15} height={12} />;
const throbberComponent = <Throbber size={15} strokeWidth={2} />;
const rightArrowIcon = <ArrowRightIcon />;

export const DecryptMessage = () => {
  const lang = useAppSelector(selectLanguage);

  const strings = lang.strings.dialogs.inheritanceEstateRecovery.decryption;

  const { onNext } = useInheritanceEstateRecoveryDialog();
  const error = false;

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
        text: strings.device.actions.confirmOnDevice,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(0, 1),
      },
      {
        id: '2',
        text: strings.device.actions.tapCard,
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

  if (error) {
    return (
      <ErrorDialog
        title={strings.error.title}
        advanceText={strings.error.message}
        primaryActionText={lang.strings.buttons.retry}
        onPrimaryClick={() => {
          // TODO: implement this function
        }}
        secondaryActionText={lang.strings.buttons.exit}
        onSecondaryClick={() => {
          // TODO: implement this function
        }}
      />
    );
  }

  return (
    <Layout>
      <ReactPlayer
        url={tapAnyCardDeviceAnimation2DVideo}
        width={506}
        height={285}
        loop
        playing
      />
      <Container direction="column">
        <Typography $fontSize={20} $textAlign="center" color="white">
          {strings.device.title}
        </Typography>
        <Typography $fontSize={16} $textAlign="center" color="white" mb={2}>
          {strings.device.subTitle}
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
      </LeanBoxContainer>
      <MessageBox type="warning" text={strings.device.messageBox.warning} />
    </Layout>
  );
};
