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
  Throbber,
  Typography,
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

  const { onNext } = useInheritancePinRecoveryDialog();
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
        text: strings.decryptPin.actions.tapCard,
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
        title={strings.decryptPin.error.title}
        advanceText={strings.decryptPin.error.subTitle}
        primaryActionText={lang.strings.buttons.retry}
        secondaryActionText={lang.strings.buttons.exit}
        onPrimaryClick={() => {
          onNext();
        }}
        onSecondaryClick={() => {
          // TODO: implement this function
        }}
      />
    );
  }

  return (
    <Layout>
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
