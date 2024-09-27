import {
  ArrowBackGoldenIcon,
  Button,
  Container,
  Flex,
} from '@cypherock/cysync-ui';
import {
  IInheritancePlan,
  InheritancePlanTypeMap,
} from '@cypherock/db-interfaces';
import React, { FC } from 'react';

import { openInheritancePinRecoveryDialog } from '~/actions';
import { selectLanguage, useAppDispatch, useAppSelector } from '~/store';

import { InheritancePageLayout } from '../Layout';

interface InheritancePageLayoutProps {
  children: React.ReactNode;
  onBack: () => void;
  plan: IInheritancePlan;
}

export const InheritancePlanDetailsLayout: FC<InheritancePageLayoutProps> = ({
  children,
  plan,
  onBack,
}) => {
  const dispatch = useAppDispatch();
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritance;

  const onRenewPlan = () => {
    // TODO: Implement renewal logic here
    alert('Renewal Clicked');
  };

  const onRecoverPin = () => {
    dispatch(openInheritancePinRecoveryDialog({ walletId: plan.walletId }));
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
            {plan.type === InheritancePlanTypeMap.silver && (
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
