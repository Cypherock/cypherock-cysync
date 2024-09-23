import { Container, Button, Lock, svgGradients } from '@cypherock/cysync-ui';
import React, { FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { selectLanguage, useAppSelector } from '~/store';
import {
  InheritancePlanDetailsGrid,
  InheritancePlanDetailsLayout,
} from './components';

export const InheritanceUnlockPlan: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritance;
  const navigate = useNavigate();

  const plan = 'silver';

  const onBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

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

  const data = {
    walletName: 'MyFunnyWallet',
    createdOn: '01 July 2024',
    expiringOn: '30 June 2024',
    reminderPeriod: 1,
    owner: {
      name: 'Alfred Bellows',
      primaryEmail: 'doc.bellows@yahoo.com',
      secondaryEmail: 'alfred@psych.com',
    },
    nominees: [
      {
        name: 'Alfred Bellows',
        primaryEmail: 'doc.bellows@yahoo.com',
        secondaryEmail: 'alfred@psych.com',
      },
      {
        name: 'Jane Doe',
        primaryEmail: 'jane.doe@example.com',
        secondaryEmail: 'jane@another.com',
      },
    ],
    executor: {
      name: 'John Smith',
      primaryEmail: 'john.smith@example.com',
      secondaryEmail: 'john@other.com',
    },
  };

  return (
    <InheritancePlanDetailsLayout
      onBack={onBack}
      plan={plan}
      onRecoverPin={onRecoverPin}
      onUpgradePlan={onUpgradePlan}
      onRenewPlan={onRenewPlan}
    >
      <Container $flex={1} width="100%" position="relative" align="flex-start">
        <div
          style={{
            width: '100%',
            filter: 'blur(4px)',
            pointerEvents: 'none',
          }}
        >
          <InheritancePlanDetailsGrid
            walletName={data.walletName}
            createdOn={data.createdOn}
            expiringOn={data.expiringOn}
            reminderPeriod={data.reminderPeriod}
            ownerName={data.owner.name}
            ownerPrimaryEmail={data.owner.primaryEmail}
            ownerSecondaryEmail={data.owner.secondaryEmail}
            nominees={data.nominees}
            executor={data.executor}
            strings={strings}
            plan={plan}
          />
        </div>

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
    </InheritancePlanDetailsLayout>
  );
};
