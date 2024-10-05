import { InheritanceEncryptMessageDeviceEvent } from '@cypherock/app-support-inheritance';
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
  QuestionMarkButton,
  tapAnyCardDeviceAnimation2DVideo,
  Throbber,
  Tooltip,
  Typography,
  Video,
} from '@cypherock/cysync-ui';
import React, { useEffect, useState } from 'react';

import { LoaderDialog } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceGoldPlanPurchaseDialog } from '../../context';
import { Layout } from '../../Layout';

const checkIconComponent = <Check width={15} height={12} />;
const throbberComponent = <Throbber size={15} strokeWidth={2} />;
const rightArrowIcon = <ArrowRightIcon />;

export const DeviceEncryption = () => {
  const lang = useAppSelector(selectLanguage);

  const strings = lang.strings.inheritanceGoldPlanPurchase.encryption.device;
  const [cardTapState, setCardTapState] = useState(-1);

  const {
    onNext,
    encryptPinDeviceEvents,
    encryptPinAbort,
    encryptPinStart,
    clearErrors,
    retryIndex,
    encryptPinIsCompleted,
    isEstablishingSession,
  } = useInheritanceGoldPlanPurchaseDialog();

  const getDeviceEventIcon = (
    loadingEvent: InheritanceEncryptMessageDeviceEvent,
    completedEvent: InheritanceEncryptMessageDeviceEvent,
  ) => {
    if (encryptPinDeviceEvents[completedEvent]) return checkIconComponent;
    if (encryptPinDeviceEvents[loadingEvent]) return throbberComponent;

    return undefined;
  };

  const actionsList = React.useMemo<LeanBoxProps[]>(() => {
    const actions: LeanBoxProps[] = [
      {
        id: '1',
        text: strings.actions.confirmOnDevice,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(
          InheritanceEncryptMessageDeviceEvent.INIT,
          InheritanceEncryptMessageDeviceEvent.CONFIRMED,
        ),
      },
    ];

    return actions;
  }, [encryptPinDeviceEvents]);

  useEffect(() => {
    const eventToState: Record<number, number | undefined> = {
      [InheritanceEncryptMessageDeviceEvent.CONFIRMED]: 0,
      [InheritanceEncryptMessageDeviceEvent.PIN_CARD_TAPPED]: 1,
      [InheritanceEncryptMessageDeviceEvent.MESSAGE_CARD_TAPPED]: 2,
    };

    let state: number | undefined;
    for (const event in eventToState) {
      if (encryptPinDeviceEvents[event] && eventToState[event] !== undefined) {
        state = eventToState[event]!;
      }
    }

    if (state !== undefined) {
      setCardTapState(state);
    }
  }, [encryptPinDeviceEvents]);

  useEffect(() => {
    clearErrors();
    encryptPinStart();
    setCardTapState(-1);

    return () => {
      encryptPinAbort();
    };
  }, [retryIndex, clearErrors]);

  useEffect(() => {
    if (encryptPinIsCompleted) {
      onNext();
    }
  }, [encryptPinIsCompleted]);

  if (isEstablishingSession) {
    return <LoaderDialog />;
  }

  return (
    <Layout>
      <Container direction="column" $width="full">
        <Video
          src={tapAnyCardDeviceAnimation2DVideo}
          autoPlay
          loop
          $width={506}
          $height={285}
        />
        <Container direction="column" gap={4} mb={4}>
          <Typography $fontSize={20} $textAlign="center" color="white">
            {strings.title}
          </Typography>
          <Container direction="row" gap={4} align="center">
            <Typography $fontSize={16} $textAlign="center" color="muted">
              <LangDisplay text={strings.subtext} />
            </Typography>
            <Tooltip text={strings.tooltip}>
              <QuestionMarkButton />
            </Tooltip>
          </Container>
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
          <CardTapList
            items={[
              {
                text: strings.actions.tapCard,
                currentState: cardTapState,
                totalState: 2,
              },
            ]}
            variant="muted"
          />
        </LeanBoxContainer>
        <MessageBox text={strings.messageBox.warning} type="warning" showIcon />
      </Container>
    </Layout>
  );
};
