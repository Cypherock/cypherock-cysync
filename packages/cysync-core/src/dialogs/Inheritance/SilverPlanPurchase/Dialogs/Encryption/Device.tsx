import { InheritanceEncryptMessageDeviceEvent } from '@cypherock/app-support-inheritance';
import {
  ArrowRightIcon,
  Check,
  Container,
  LeanBox,
  LeanBoxContainer,
  LeanBoxProps,
  MessageBox,
  Throbber,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useEffect } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceSilverPlanPurchaseDialog } from '../../context';
import { Layout } from '../../Layout';

const checkIconComponent = <Check width={15} height={12} />;
const throbberComponent = <Throbber size={15} strokeWidth={2} />;
const rightArrowIcon = <ArrowRightIcon />;

export const DeviceEncryption = () => {
  const lang = useAppSelector(selectLanguage);

  const strings = lang.strings.inheritanceSilverPlanPurchase.encryption.device;

  const {
    onNext,
    encryptPinDeviceEvents,
    encryptPinAbort,
    encryptPinStart,
    clearErrors,
    retryIndex,
    encryptPinIsCompleted,
  } = useInheritanceSilverPlanPurchaseDialog();

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
        text: strings.actions.confirm,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(
          InheritanceEncryptMessageDeviceEvent.INIT,
          InheritanceEncryptMessageDeviceEvent.CONFIRMED,
        ),
      },
      {
        id: '2',
        text: strings.actions.tapCard,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(
          InheritanceEncryptMessageDeviceEvent.CONFIRMED,
          InheritanceEncryptMessageDeviceEvent.CARD_TAPPED,
        ),
      },
    ];

    return actions;
  }, [encryptPinDeviceEvents]);

  useEffect(() => {
    clearErrors();
    encryptPinStart();

    return () => {
      encryptPinAbort();
    };
  }, [retryIndex, clearErrors]);

  useEffect(() => {
    if (encryptPinIsCompleted) {
      onNext();
    }
  }, [encryptPinIsCompleted]);

  return (
    <Layout>
      <Container direction="column" $width="full">
        <Typography $fontSize={20} $textAlign="center" color="white" mb={4}>
          {strings.title}
        </Typography>
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
        </LeanBoxContainer>
        <MessageBox text={strings.messageBox.warning} type="warning" showIcon />
      </Container>
    </Layout>
  );
};
