import { SignTransactionDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  ArrowRightIcon,
  Check,
  Container,
  Flex,
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
import React, { useEffect } from 'react';

import { LoaderDialog } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceEditEncryptedMessageDialog } from '../context';
import { Layout } from '../Layout';

const checkIconComponent = <Check width={15} height={12} />;
const throbberComponent = <Throbber size={15} strokeWidth={2} />;
const rightArrowIcon = <ArrowRightIcon />;

export const Encryption = () => {
  const lang = useAppSelector(selectLanguage);

  const strings =
    lang.strings.dialogs.inheritanceEditEncryptedMessage.encryption;

  const { onNext } = useInheritanceEditEncryptedMessageDialog();
  const loading = false;

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
        text: strings.actions.enterPinAndTap,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(0, 1),
      },
    ];

    return actions;
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onNext();
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <LoaderDialog
        title={strings.syncing.title}
        subtext={strings.syncing.subTitle}
      />
    );
  }

  return (
    <Layout>
      <Video
        src={tapAnyCardDeviceAnimation2DVideo}
        autoPlay
        loop
        $width={506}
        $height={285}
      />
      <Container direction="column" gap={4}>
        <Typography $fontSize={20} $textAlign="center" color="white">
          {strings.title}
        </Typography>
        <Typography $fontSize={16} $textAlign="center" color="muted">
          <Flex gap={4} align="center">
            <LangDisplay text={strings.subTitle} />
            <Tooltip text={strings.tooltip}>
              <QuestionMarkButton />
            </Tooltip>
          </Flex>
        </Typography>
      </Container>
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
      <MessageBox type="warning" text={strings.messageBox.warning} />
    </Layout>
  );
};
