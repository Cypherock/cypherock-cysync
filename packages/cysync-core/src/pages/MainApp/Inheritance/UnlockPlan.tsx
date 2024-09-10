import {
  Container,
  Flex,
  Button,
  ArrowBackGoldenIcon,
  Image,
  unlockGoldPlan,
  unlockSilverPlan,
  Lock,
  svgGradients,
} from '@cypherock/cysync-ui';
import React, { FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { selectLanguage, useAppSelector } from '~/store';
import { InheritancePageLayout } from './Layout';

export const InheritanceUnlockPlan: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritance;
  const navigate = useNavigate();

  const currentPlan = 'gold';

  const onBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <InheritancePageLayout>
      <Container direction="column" gap={24} $flex={1}>
        <Container width="100%" justify="space-between" pt={4}>
          <Button
            variant="icon"
            icon={<ArrowBackGoldenIcon />}
            onClick={onBack}
          />
          <Flex justify="center" gap={16}>
            <Button
              variant="secondary"
              onClick={() => {
                'impliment this function';
              }}
            >
              {strings.buttons.recoverPin}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                'impliment this function';
              }}
            >
              {strings.buttons.renewPlan}
            </Button>
          </Flex>
        </Container>
        <Container
          $flex={1}
          width="100%"
          position="relative"
          justify="center"
          align="center"
          $zIndex={10}
        >
          <Image
            src={currentPlan === 'gold' ? unlockGoldPlan : unlockSilverPlan}
            alt="unlock gold plan"
            $zIndex={-10}
            position="absolute"
            $height="100%"
            $width="100%"
          />
          <Container direction="column" gap={16}>
            <Container
              height={145}
              width={145}
              $bgColor="primary"
              display="flex"
              justify="center"
              align="center"
              $borderRadius={200}
            >
              <Lock
                fill={`url(#${svgGradients.gold})`}
                width={45}
                height={59}
              />
            </Container>
            <Button
              variant="primary"
              onClick={() => {
                'impliment this function';
              }}
            >
              {strings.buttons.unlock}
            </Button>
          </Container>
        </Container>
      </Container>
    </InheritancePageLayout>
  );
};
