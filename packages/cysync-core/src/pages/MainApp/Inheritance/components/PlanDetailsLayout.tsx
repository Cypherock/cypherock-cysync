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
  onRecoverPin?: () => void;
  onUpgradePlan?: () => void;
  onRenewPlan?: () => void;
}

export const InheritancePlanDetailsLayout: FC<InheritancePageLayoutProps> = ({
  children,
  plan,
  onBack,
  onRecoverPin,
  onRenewPlan,
  onUpgradePlan,
}) => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritance;
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
            {onRecoverPin && (
              <Button
                variant="secondary"
                onClick={() => {
                  'impliment this function';
                }}
              >
                {strings.buttons.recoverPin}
              </Button>
            )}
            {onUpgradePlan && plan === 'silver' && (
              <Button
                variant="secondary"
                onClick={() => {
                  'impliment this function';
                }}
              >
                {strings.buttons.upgradePlan}
              </Button>
            )}
            {onRenewPlan && (
              <Button
                variant="primary"
                onClick={() => {
                  'impliment this function';
                }}
              >
                {strings.buttons.renewPlan}
              </Button>
            )}
          </Flex>
        </Container>
        {children}
      </Container>
    </InheritancePageLayout>
  );
};

InheritancePlanDetailsLayout.defaultProps = {
  onRecoverPin: undefined,
  onRenewPlan: undefined,
  onUpgradePlan: undefined,
};
