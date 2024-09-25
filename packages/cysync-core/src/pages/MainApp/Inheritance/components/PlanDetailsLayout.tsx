import {
  ArrowBackGoldenIcon,
  Button,
  Container,
  Flex,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { InheritancePageLayout } from '../Layout';
import { InheritancePlanType } from '@cypherock/db-interfaces';

interface InheritancePageLayoutProps {
  children: React.ReactNode;
  onBack: () => void;
  plan: InheritancePlanType;
}

export const InheritancePlanDetailsLayout: FC<InheritancePageLayoutProps> = ({
  children,
  plan,
  onBack,
}) => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritance;

  const onRenewPlan = () => {
    // TODO: Implement renewal logic here
    alert('Renewal Clicked');
  };

  const onRecoverPin = () => {
    // TODO: Implement pin recovery logic here
    alert('Pin Recovery Clicked');
  };

  const onUpgradePlan = () => {
    // TODO: Implement plan upgrade logic here
    alert('Upgrade Plan Clicked');
  };

  return (
    <InheritancePageLayout>
      <Container direction="column" $flex={1} gap={32} justify="flex-start">
        <Container width="100%" justify="space-between" pt={4}>
          <Button
            variant="icon"
            icon={<ArrowBackGoldenIcon />}
            onClick={onBack}
          />
          <Flex justify="center" gap={16}>
            <Button variant="secondary" onClick={onRecoverPin}>
              {strings.buttons.recoverPin}
            </Button>
            {plan === 'silver' && (
              <Button variant="secondary" onClick={onUpgradePlan}>
                {strings.buttons.upgradePlan}
              </Button>
            )}
            <Button variant="primary" onClick={onRenewPlan}>
              {strings.buttons.renewPlan}
            </Button>
          </Flex>
        </Container>
        {children}
      </Container>
    </InheritancePageLayout>
  );
};
