import { SignTransactionDeviceEvent } from '@cypherock/coin-support-interfaces';
import {
  ArrowRightIcon,
  Check,
  Container,
  Flex,
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

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceGoldPlanPurchaseDialog } from '../../context';
import { Layout } from '../../Layout';

const checkIconComponent = <Check width={15} height={12} />;
const throbberComponent = <Throbber size={15} strokeWidth={2} />;
const rightArrowIcon = <ArrowRightIcon />;

export const DeviceEncryption = () => {
  const lang = useAppSelector(selectLanguage);

  const strings = lang.strings.inheritanceGoldPlanPurchase.encryption.device;

  const { onNext } = useInheritanceGoldPlanPurchaseDialog();

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
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Layout>
      <Video
        src={tapAnyCardDeviceAnimation2DVideo}
        $width={420}
        $height={236}
        loop
        autoPlay
      />
      <Container direction="column" $width="full">
        <Container direction="column" gap={4}>
          <Typography $fontSize={20} $textAlign="center" color="white">
            {strings.title}
          </Typography>
          <Flex align="center" mb={4} gap={4}>
            <Typography $fontSize={16} $textAlign="center" color="muted">
              {strings.subtext}
            </Typography>
            <Tooltip text={strings.tooltip} tooltipPlacement="bottom">
              <QuestionMarkButton />
            </Tooltip>
          </Flex>
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
        <MessageBox text={strings.messageBox.warning} type="warning" showIcon />
      </Container>
    </Layout>
  );
};
