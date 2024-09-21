import {
  Container,
  Flex,
  Button,
  ArrowBackGoldenIcon,
  Lock,
  svgGradients,
} from '@cypherock/cysync-ui';
import React, { FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { selectLanguage, useAppSelector } from '~/store';
import { InheritancePageLayout } from './Layout';
import { DummyPlanDetails } from './components';

export const InheritanceUnlockPlan: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritance;
  const navigate = useNavigate();

  const currentPlan = 'silver';

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
              {strings.buttons.upgradePlan}
            </Button>
            <Button
              variant="primary"
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
          align="flex-start"
        >
          <DummyPlanDetails plan={currentPlan} />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            <Container direction="column" gap={16}>
              <Container
                height={145}
                width={145}
                $bgColor="separator"
                display="flex"
                justify="center"
                align="center"
                $borderRadius={200}
              >
                <Lock
                  fill={`url(#${svgGradients.gold})`}
                  width={68}
                  height={68}
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
          </div>
        </Container>
      </Container>
    </InheritancePageLayout>
  );
};
