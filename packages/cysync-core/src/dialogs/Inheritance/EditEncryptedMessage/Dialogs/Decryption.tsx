import { SignTransactionDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  ArrowRightIcon,
  Check,
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

import { LoaderDialog } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceEditEncryptedMessageDialog } from '../context';
import { Layout } from '../Layout';

const checkIconComponent = <Check width={15} height={12} />;
const throbberComponent = <Throbber size={15} strokeWidth={2} />;
const rightArrowIcon = <ArrowRightIcon />;

export const Decryption = () => {
  const lang = useAppSelector(selectLanguage);

  const strings =
    lang.strings.dialogs.inheritanceEditEncryptedMessage.decryption.wallet;

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
        text: strings.actions.confirm,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(0, 1),
      },
      {
        id: '2',
        text: strings.actions.tapCard,
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
        title={strings.decryption.title}
        subtext={strings.decryption.subTitle}
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
      <Typography $fontSize={20} $textAlign="center" color="white" mb={4}>
        {strings.title}
      </Typography>
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
      <MessageBox type="warning" text={strings.messageBox.warning} />
    </Layout>
  );
};
