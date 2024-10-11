import {
  DashboardWallet,
  Divider,
  Flex,
  Typography,
} from '@cypherock/cysync-ui';
import { IInheritancePlan } from '@cypherock/db-interfaces';
import React, { FC, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import {
  openInheritanceEstateRecoveryDialog,
  openInheritanceSyncPlansDialog,
} from '~/actions';
import { routes } from '~/constants';
import { useNavigateTo } from '~/hooks';
import {
  selectInheritancePlans,
  selectLanguage,
  useAppSelector,
} from '~/store';

import { InheritancePageLayout } from '../Layout';

export const InheritancePlanList: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useDispatch();
  const inheritancePlans = useAppSelector(selectInheritancePlans);
  const navigateTo = useNavigateTo();

  const openSyncPlans = useCallback(() => {
    dispatch(openInheritanceSyncPlansDialog());
  }, [dispatch]);

  const toSetup = useCallback(() => {
    navigateTo(routes.inheritance.choosePlan.path);
  }, [navigateTo]);

  const ownerPlans = useMemo(
    () => inheritancePlans.filter(p => !p.isNominee),
    [inheritancePlans],
  );
  const nomineePlans = useMemo(
    () => inheritancePlans.filter(p => p.isNominee),
    [inheritancePlans],
  );

  const hasNomineePlans = nomineePlans.length > 0;

  const toPlanDetails = (plan: IInheritancePlan) => {
    navigateTo(
      `${routes.inheritance.planDetails.path}?walletId=${plan.walletId}`,
    );
  };

  const toEstateRecovery = (plan: IInheritancePlan) => {
    dispatch(openInheritanceEstateRecoveryDialog({ walletId: plan.walletId }));
  };

  const getPlanCardComponent = (plan: IInheritancePlan) => {
    const currentDate = Date.now();

    const isExpiring = Boolean(
      plan.purchasedAt &&
        plan.expireAt &&
        plan.expireAt < currentDate + 1 * 30 * 24 * 60 * 60 * 1000,
    );

    const isExpired = Boolean(
      plan.purchasedAt && plan.expireAt && plan.expireAt < currentDate,
    );

    const isPaymentPending = !(plan.purchasedAt && plan.expireAt);

    return (
      <DashboardWallet
        key={plan.__id}
        isNone={false}
        type={plan.type}
        isExpiring={isExpiring}
        isExpired={isExpired}
        isPaymentPending={isPaymentPending}
        name={plan.walletName}
        lang={lang.strings}
        startDate={plan.purchasedAt ?? plan.meta?.created ?? currentDate}
        expiryDate={plan.expireAt ?? currentDate}
        onClick={() =>
          plan.isNominee ? toEstateRecovery(plan) : toPlanDetails(plan)
        }
      />
    );
  };

  return (
    <InheritancePageLayout
      onActionButtonClick={openSyncPlans}
      actionButtonText={lang.strings.inheritance.buttons.syncFromEmail}
    >
      <Flex direction="column" $flex={1} gap={32}>
        <Flex direction="column" gap={24}>
          <Flex direction="column" gap={8}>
            <Typography variant="h6">
              {lang.strings.inheritance.homePage.headers.owner.title}
            </Typography>
            <Typography variant="p" color="muted" $fontSize={14}>
              {lang.strings.inheritance.homePage.headers.owner.subtitle}
            </Typography>
          </Flex>
          <Flex gap={16} $flex={1} width="100%" $flexWrap="wrap">
            <DashboardWallet
              isNone
              type="silver"
              isExpiring={false}
              isExpired={false}
              isPaymentPending={false}
              name=""
              lang={lang.strings}
              startDate={0}
              expiryDate={0}
              onClick={toSetup}
            />
            {ownerPlans.map(getPlanCardComponent)}
          </Flex>
        </Flex>
        {hasNomineePlans && (
          <>
            <Divider variant="horizontal" />
            <Flex direction="column" gap={24}>
              <Flex direction="column" gap={8}>
                <Typography variant="h6">
                  {lang.strings.inheritance.homePage.headers.nominee.title}
                </Typography>
                <Typography variant="p" color="muted" $fontSize={14}>
                  {lang.strings.inheritance.homePage.headers.nominee.subtitle}
                </Typography>
              </Flex>
              <Flex gap={16} $flex={1} width="100%" $flexWrap="wrap">
                {nomineePlans.map(getPlanCardComponent)}
              </Flex>
            </Flex>
          </>
        )}
      </Flex>
    </InheritancePageLayout>
  );
};
