import { format as formatDate } from 'date-fns';
import React, { FC, useMemo } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { InheritancePlanDetailsSectionProps } from './types';

import {
  InheritancePlanData,
  InheritancePlanDetailsGrid,
  InheritancePlanDetailsLayout,
  UserDetails,
} from '../components';

const planDetailsObjectKeyMapper = (obj: {
  name: string;
  email: string;
  alternateEmail: string;
}) => ({
  name: obj.name,
  primaryEmail: obj.email,
  secondaryEmail: obj.alternateEmail,
});

export const InheritancePlanDetailsSection: FC<
  InheritancePlanDetailsSectionProps
> = ({ onBack, plan, planDetails }) => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritance;

  const data = useMemo<InheritancePlanData>(() => {
    const wallet = {
      walletName: planDetails.name,
      createdOn: formatDate(planDetails.activationDate, 'dd MMMM yyyy'),
      expiringOn: formatDate(planDetails.expiryDate, 'dd MMMM yyyy'),
      onEdit: () => {
        alert('Edit reminder period clicked!!');
      },
    };

    const owner = {
      ...planDetailsObjectKeyMapper(planDetails.owner),
      onEdit: () => {
        alert('Edit owner details clicked!!');
      },
    };

    let nominees: UserDetails[] | undefined;
    if (planDetails.nominee.length > 0)
      nominees = planDetails.nominee.map((n, index) => ({
        ...planDetailsObjectKeyMapper(n),
        onEdit: () => alert(`Edit nominee #${index + 1} dialog`),
        onSecondaryEdit: () => alert('Edit encrypted messages dialog'),
      }));

    let executor: UserDetails | undefined;
    if (planDetails.executor)
      executor = {
        ...planDetailsObjectKeyMapper(planDetails.executor),
        onEdit: () => alert(`Edit executor dialog`),
        onSecondaryEdit: () => alert('Edit executor message dialog'),
      };

    return {
      wallet,
      owner,
      nominees,
      executor,
    };
  }, [planDetails, plan]);

  return (
    <InheritancePlanDetailsLayout onBack={onBack} plan={plan}>
      <InheritancePlanDetailsGrid
        data={data}
        strings={strings}
        planType={plan.type}
      />
    </InheritancePlanDetailsLayout>
  );
};
