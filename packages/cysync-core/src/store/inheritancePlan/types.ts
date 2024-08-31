import { IInheritancePlan } from '@cypherock/db-interfaces';

export interface IInheritancePlanState {
  isLoaded: boolean;
  inheritancePlans: IInheritancePlan[];
}
