import { IInheritancePlan } from '@cypherock/db-interfaces';

import { IInheritancePlanDetails } from '~/store';

export interface InheritancePlanDetailsSectionProps {
  onBack: () => void;
  plan: IInheritancePlan;
  planDetails: IInheritancePlanDetails;
}

export interface InheritanceLockedPlanSectionProps {
  onBack: () => void;
  plan: IInheritancePlan;
  onUnlock: () => void;
}
