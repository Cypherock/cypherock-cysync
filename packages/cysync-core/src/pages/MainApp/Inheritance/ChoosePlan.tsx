import {
  Typography,
  Container,
  Flex,
  PlanCard,
  Button,
  ArrowBackGoldenIcon,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { InheritancePageLayout } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';

export const ChoosePlan: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritance.choosePlan;

  const SilverPlanFeatures = strings.plans.features.map((cur, i) => ({
    text: cur,
    available: i < 3,
  }));

  const GoldPlanFeatures = strings.plans.features.map(cur => ({
    text: cur,
    available: true,
  }));

  return (
    <InheritancePageLayout>
      <Container direction="column" gap={24} $flex={1}>
        <Container width="100%" justify="space-between" pt={4}>
          <Button
            variant="icon"
            icon={<ArrowBackGoldenIcon />}
            onClick={() => {
              'implement this function';
            }}
          />
          <Flex width="100%" justify="center">
            <Typography variant="h2" $fontWeight="medium">
              {strings.title}
            </Typography>
          </Flex>
        </Container>
        <Container $flex={1}>
          <Flex gap={24}>
            <PlanCard
              type="silver"
              heading={strings.plans.silver.heading}
              description={strings.plans.silver.description}
              buttonText={strings.plans.buttonText}
              features={SilverPlanFeatures}
              onClick={() => {
                'implement this function';
              }}
            />
            <PlanCard
              type="gold"
              heading={strings.plans.gold.heading}
              description={strings.plans.gold.description}
              buttonText={strings.plans.buttonText}
              features={GoldPlanFeatures}
              popularTagText={strings.plans.popularTagText}
              onClick={() => {
                'implement this function';
              }}
            />
          </Flex>
        </Container>
      </Container>
    </InheritancePageLayout>
  );
};
