import { SignTransactionDeviceEvent } from '@cypherock/coin-support-interfaces';
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
  tapAnyCardDeviceAnimation2DVideo,
  Throbber,
  Typography,
  Video,
} from '@cypherock/cysync-ui';
import React, { useEffect, useState } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceEstateRecoveryDialog } from '../context';
import { Layout } from '../Layout';

const checkIconComponent = <Check width={15} height={12} />;
const throbberComponent = <Throbber size={15} strokeWidth={2} />;
const rightArrowIcon = <ArrowRightIcon />;

export const WalletAuth = () => {
  const lang = useAppSelector(selectLanguage);

  const strings = lang.strings.dialogs.inheritanceEstateRecovery;

  const { onNext, selectedWallet } = useInheritanceEstateRecoveryDialog();

  const [cardTapState, setCardTapState] = useState(0);

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
        text: strings.wallet.actions.confirm,
        leftImage: rightArrowIcon,
        rightImage: getDeviceEventIcon(0, 1),
      },
    ];

    return actions;
  }, []);

  useEffect(() => {
    setCardTapState(0);
    const timeout = setTimeout(() => {
      onNext();
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Layout>
      <Video
        src={tapAnyCardDeviceAnimation2DVideo}
        $width={506}
        $height={285}
        loop
        autoPlay
      />
      <Container direction="column" mb={2}>
        <Typography $fontSize={20} $textAlign="center" color="white">
          {strings.wallet.title}
        </Typography>
        <Typography $fontSize={16} $textAlign="center" color="muted">
          <LangDisplay text={strings.wallet.subTitle} />
          <Typography variant="span" $fontWeight="bold" $fontSize={16}>
            {selectedWallet?.name}
          </Typography>
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
        <CardTapList
          items={[
            {
              text: strings.wallet.actions.tapCard,
              currentState: cardTapState,
              totalState: 2,
            },
          ]}
          variant="muted"
        />
      </LeanBoxContainer>
      <MessageBox type="warning" text={strings.wallet.messageBox.warning} />
    </Layout>
  );
};