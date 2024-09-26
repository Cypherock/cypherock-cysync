import {
  CardTapList,
  Container,
  Flex,
  LeanBoxContainer,
  MessageBox,
  QuestionMarkButton,
  tapAnyCardDeviceAnimation2DVideo,
  Tooltip,
  Typography,
  Video,
} from '@cypherock/cysync-ui';
import React, { useEffect, useState } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceGoldPlanPurchaseDialog } from '../../context';
import { Layout } from '../../Layout';

export const DeviceEncryption = () => {
  const lang = useAppSelector(selectLanguage);

  const strings = lang.strings.inheritanceGoldPlanPurchase.encryption.device;

  const { onNext } = useInheritanceGoldPlanPurchaseDialog();

  const [cardTapState, setCardTapState] = useState(0);

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
