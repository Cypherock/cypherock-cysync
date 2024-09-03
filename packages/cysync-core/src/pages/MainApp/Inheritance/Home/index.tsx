import React from 'react';

import { selectInheritancePlans, useAppSelector } from '~/store';

import { InheritancePlanList } from './PlanList';
import { InheritanceSetup } from './Setup';

export const InheritanceHome = () => {
  const inheritancePlans = useAppSelector(selectInheritancePlans);

  if (inheritancePlans.length <= 0) {
    return <InheritanceSetup />;
  }

  return <InheritancePlanList />;
};
