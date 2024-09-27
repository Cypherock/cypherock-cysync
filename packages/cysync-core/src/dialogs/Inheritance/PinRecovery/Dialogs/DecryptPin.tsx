import { InheritanceDecryptMessageDeviceEvent } from '@cypherock/app-support-inheritance';
import {
  ArrowRightIcon,
  Check,
  Container,
  LeanBox,
  LeanBoxContainer,
  LeanBoxProps,
  MessageBox,
  tapAnyCardDeviceAnimation2DVideo,
  Throbber,
  Typography,
  Video,
} from '@cypherock/cysync-ui';
import React, { useEffect } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritancePinRecoveryDialog } from '../context';
import { Layout } from '../Layout';

const checkIconComponent = <Check width={15} height={12} />;
const throbberComponent = <Throbber size={15} strokeWidth={2} />;
const rightArrowIcon = <ArrowRightIcon />;

export const DecryptPin = () => {
  const lang = useAppSelector(selectLanguage);

  const strings = lang.strings.dialogs.inheritancePinRecovery;

  const {
    onNext,
    retryIndex,
    clearErrors,
    decryptPinStart,
    decryptPinDeviceEvents,
  } = useInheritancePinRecoveryDialog();

  const getDeviceEventIcon = (
    loadingEvent: InheritanceDecryptMessageDeviceEvent,
    completedEvent: InheritanceDecryptMessageDeviceEvent,
  ) => {
    if (decryptPinDeviceEvents[completedEvent]) return checkIconComponent;
    if (decryptPinDeviceEvents[loadingEvent]) return throbberComponent;

    return undefined;
  };

  const actionsList = React.useMemo<LeanBoxProps[]>(() => {
    const actions: LeanBoxProps[] = [
      {
        id: '1',
        text: strings.decryptPin.actions.confirmOnDevice,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(
          InheritanceDecryptMessageDeviceEvent.INIT,
          InheritanceDecryptMessageDeviceEvent.CONFIRMED,
        ),
      },
      {
        id: '2',
        text: strings.decryptPin.actions.tapCard,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(
          InheritanceDecryptMessageDeviceEvent.CONFIRMED,
          InheritanceDecryptMessageDeviceEvent.CARD_TAPPED,
        ),
      },
    ];

    return actions;
  }, [decryptPinDeviceEvents]);

  useEffect(() => {
    clearErrors();
    decryptPinStart();
  }, [retryIndex, clearErrors]);

  useEffect(() => {
    if (
      decryptPinDeviceEvents[InheritanceDecryptMessageDeviceEvent.CARD_TAPPED]
    ) {
      setTimeout(() => onNext(), 2000);
    }
  }, [decryptPinDeviceEvents]);

  return (
    <Layout>
      <Video
        src={tapAnyCardDeviceAnimation2DVideo}
        loop
        autoPlay
        $width={420}
        $height={236}
      />
      <Container direction="column" width="100%" $flex={1} gap={16}>
        <Typography $fontSize={20} $textAlign="center" color="white" mb={4}>
          {strings.decryptPin.title}
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
        <MessageBox
          type="warning"
          text={strings.decryptPin.messageBox.warning}
        />
      </Container>
    </Layout>
  );
};
