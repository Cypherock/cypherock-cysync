import { format as formatDate } from 'date-fns';
import React, { FC, useCallback, useMemo } from 'react';

import {
  openInheritanceEditEncryptedMessageDialog,
  openInheritanceEditExecutorMessageDialog,
  openInheritanceEditReminderTimeDialog,
  openInheritanceEditUserDetailsDialog,
} from '~/actions';
import { selectLanguage, useAppDispatch, useAppSelector } from '~/store';

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
  const dispatch = useAppDispatch();

  const editReminder = useCallback(() => {
    dispatch(
      openInheritanceEditReminderTimeDialog({ walletId: plan.walletId }),
    );
  }, [dispatch]);

  const editOwnerDetails = useCallback(() => {
    dispatch(openInheritanceEditUserDetailsDialog({ userType: 'owner' }));
  }, [dispatch]);

  const editNomineeDetails = useCallback(() => {
    dispatch(openInheritanceEditUserDetailsDialog({ userType: 'nominee' }));
  }, [dispatch]);

  const editExecutorDetails = useCallback(() => {
    dispatch(openInheritanceEditUserDetailsDialog({ userType: 'executor' }));
  }, [dispatch]);

  const editExecutorMessage = useCallback(() => {
    dispatch(
      openInheritanceEditExecutorMessageDialog({ walletId: plan.walletId }),
    );
  }, [dispatch, plan]);

  const editEncryptedMessage = useCallback(() => {
    dispatch(openInheritanceEditEncryptedMessageDialog());
  }, [dispatch]);

  const data = useMemo<InheritancePlanData>(() => {
    const wallet = {
      walletName: planDetails.name,
      createdOn: formatDate(planDetails.activationDate, 'dd MMMM yyyy'),
      expiringOn: formatDate(planDetails.expiryDate, 'dd MMMM yyyy'),
      onEdit: editReminder,
    };

    if (planDetails.reminderPeriod)
      Object.assign(wallet, { reminderPeriod: planDetails.reminderPeriod });

    const owner = {
      ...planDetailsObjectKeyMapper(planDetails.owner),
      onEdit: editOwnerDetails,
    };

    let nominees: UserDetails[] | undefined;
    if (planDetails.nominee.length > 0)
      nominees = planDetails.nominee.map(n => ({
        ...planDetailsObjectKeyMapper(n),
        onEdit: editNomineeDetails,
        onSecondaryEdit: editEncryptedMessage,
      }));

    let executor: UserDetails | undefined;
    if (planDetails.executor)
      executor = {
        ...planDetailsObjectKeyMapper(planDetails.executor),
        onEdit: editExecutorDetails,
        onSecondaryEdit: editExecutorMessage,
      };

    return {
      wallet,
      owner,
      nominees,
      executor,
    };
  }, [
    planDetails,
    plan,
    editEncryptedMessage,
    editExecutorMessage,
    editNomineeDetails,
    editExecutorDetails,
    editOwnerDetails,
    editReminder,
  ]);

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
