import React, { FC } from 'react';

import { InheritancePlanDetailsSection } from './Details';
import { InheritanceLockedPlan } from './LockedPlan';

import { useInheritancePlanPage } from '../hooks';

export const InheritancePlanDetails: FC = () => {
  const { plan, planDetails, onBack, onUnlock } = useInheritancePlanPage();

  if (!plan) return null;

  if (!planDetails)
    return (
      <InheritanceLockedPlan plan={plan} onBack={onBack} onUnlock={onUnlock} />
    );

  return (
    <InheritancePlanDetailsSection
      plan={plan}
      onBack={onBack}
      planDetails={planDetails}
    />
  );
};
