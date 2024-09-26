import { format as formatDate } from 'date-fns';
import React, { FC, useMemo } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { InheritancePlanDetailsSectionProps } from './types';

import {
  InheritancePlanData,
  InheritancePlanDetailsGrid,
  InheritancePlanDetailsLayout,
} from '../components';

export const InheritancePlanDetailsSection: FC<
  InheritancePlanDetailsSectionProps
> = ({ onBack, plan, planDetails }) => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritance;

  // TODO: Handle gold plan data
  const data = useMemo<InheritancePlanData>(
    () => ({
      wallet: {
        walletName: planDetails.name,
        createdOn: formatDate(planDetails.activationDate, 'dd MMMM yyyy'),
        expiringOn: formatDate(planDetails.expiryDate, 'dd MMMM yyyy'),
        onEdit: () => {
          alert('Edit reminder period clicked!!');
        },
      },
      owner: {
        name: 'Alfred Bellows',
        primaryEmail: planDetails.owner.email,
        secondaryEmail: planDetails.owner.alternateEmail,
        onEdit: () => {
          alert('Edit owner details clicked!!');
        },
      },
    }),
    [planDetails],
  );

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
