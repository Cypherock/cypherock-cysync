import { InheritanceDecryptMessageDeviceEvent } from '@cypherock/app-support-inheritance';
import {
  ArrowRightIcon,
  Check,
  Container,
  LeanBox,
  LeanBoxContainer,
  LeanBoxProps,
  Throbber,
  Typography,
  VerifyPinDeviceGraphics,
} from '@cypherock/cysync-ui';
import React, { useEffect } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritancePinRecoveryDialog } from '../context';
import { Layout } from '../Layout';

const checkIconComponent = <Check width={15} height={12} />;
const throbberComponent = <Throbber size={15} strokeWidth={2} />;
const rightArrowIcon = <ArrowRightIcon />;

export const ViewPin = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.dialogs.inheritancePinRecovery.viewPin;

  const { onNext, decryptPinIsCompleted, decryptPinDeviceEvents } =
    useInheritancePinRecoveryDialog();

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
        text: strings.actions.viewDevice,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(
          InheritanceDecryptMessageDeviceEvent.CARD_TAPPED,
          InheritanceDecryptMessageDeviceEvent.PIN_VERIFIED,
        ),
      },
    ];

    return actions;
  }, [decryptPinDeviceEvents]);

  useEffect(() => {
    if (decryptPinIsCompleted) {
      onNext();
    }
  }, [decryptPinIsCompleted]);

  return (
    <Layout>
      <VerifyPinDeviceGraphics />
      <Container direction="column" width="100%" $flex={1} gap={16}>
        <Typography $fontSize={20} $textAlign="center" color="white" mb={4}>
          {strings.title}
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
      </Container>
    </Layout>
  );
};
