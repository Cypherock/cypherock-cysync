import React from 'react';

import { InheritancePlanList } from './PlanList';
import { InheritanceSetup } from './Setup';

export const InheritanceHome = () => {
  if (true) {
    return <InheritanceSetup />;
  }

  return <InheritancePlanList />;
};
