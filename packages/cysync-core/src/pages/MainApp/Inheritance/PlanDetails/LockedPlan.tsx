import { Container, Button, Lock, svgGradients } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { InheritanceLockedPlanSectionProps } from './types';

import {
  InheritancePlanDetailsGrid,
  InheritancePlanDetailsLayout,
} from '../components';

export const InheritanceLockedPlan: FC<InheritanceLockedPlanSectionProps> = ({
  plan,
  onBack,
  onUnlock,
}) => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritance;

  const data = {
    wallet: {
      walletName: 'MyFunnyWallet',
      createdOn: '01 July 2024',
      expiringOn: '30 June 2024',
      reminderPeriod: 1,
      onEdit: () => {
        alert('Edit reminder period clicked!!');
      },
    },
    owner: {
      name: 'Alfred Bellows',
      primaryEmail: 'doc.bellows@yahoo.com',
      secondaryEmail: 'alfred@psych.com',
      onEdit: () => {
        alert('Edit owner details clicked!!');
      },
    },
    nominees: [
      {
        name: 'Alfred Bellows',
        primaryEmail: 'doc.bellows@yahoo.com',
        secondaryEmail: 'alfred@psych.com',
        onEdit: () => {
          alert('Edit nominee details clicked!!');
        },
        onSecondaryEdit: () => {
          alert('Edit encrypted message clicked!!');
        },
      },
      {
        name: 'Jane Doe',
        primaryEmail: 'jane.doe@example.com',
        secondaryEmail: 'jane@another.com',
        onEdit: () => {
          alert('Edit nominee details clicked!!');
        },
        onSecondaryEdit: () => {
          alert('Edit encrypted message clicked!!');
        },
      },
    ],
    executor: {
      name: 'John Smith',
      primaryEmail: 'john.smith@example.com',
      secondaryEmail: 'john@other.com',
      onEdit: () => {
        alert('Edit executor details clicked!!');
      },
      onSecondaryEdit: () => {
        alert('Edit executor message clicked!!');
      },
    },
  };

  return (
    <InheritancePlanDetailsLayout onBack={onBack} plan={plan}>
      <Container $flex={1} width="100%" position="relative" align="flex-start">
        <div
          style={{
            width: '100%',
            filter: 'blur(4px)',
            pointerEvents: 'none',
          }}
        >
          <InheritancePlanDetailsGrid
            data={data}
            strings={strings}
            planType={plan.type}
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
            <Button variant="primary" onClick={onUnlock}>
              {strings.buttons.unlock}
            </Button>
          </Container>
        </div>
      </Container>
    </InheritancePlanDetailsLayout>
  );
};
