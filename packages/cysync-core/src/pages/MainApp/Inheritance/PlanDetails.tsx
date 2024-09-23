import React, { FC, useCallback } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useNavigate } from 'react-router-dom';
import {
  InheritancePlanDetailsGrid,
  InheritancePlanDetailsLayout,
} from './components';

export const InheritancePlanDetails: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritance;
  const navigate = useNavigate();
  const plan = 'gold';

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
      onRenewPlan={onRenewPlan}
      onUpgradePlan={onUpgradePlan}
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
    </InheritancePlanDetailsLayout>
  );
};
