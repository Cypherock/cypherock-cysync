import React, { FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { selectLanguage, useAppSelector } from '~/store';

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
      <InheritancePlanDetailsGrid data={data} strings={strings} plan={plan} />
    </InheritancePlanDetailsLayout>
  );
};
