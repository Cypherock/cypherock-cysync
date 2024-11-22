import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { openInheritancePlanLoginDialog } from '~/actions';
import { useQuery, useMemoReturn } from '~/hooks';
import {
  useAppSelector,
  selectInheritancePlans,
  useAppDispatch,
  clearInheritancePlanDetails,
} from '~/store';

export const useInheritancePlanPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const query = useQuery();
  const plans = useAppSelector(selectInheritancePlans);

  const allPlanDetails = useAppSelector(
    state => state.inheritance.inheritancePlanDetails,
  );

  const onBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const plan = useMemo(() => {
    const walletId = query.get('walletId');
    if (!walletId) return undefined;

    return plans.find(p => p.walletId.toLowerCase() === walletId.toLowerCase());
  }, [plans, query]);

  const planDetails = useMemo(() => {
    if (!plan) return undefined;

    return allPlanDetails[plan.walletId];
  }, [allPlanDetails, plan]);

  const onUnlock = useCallback(() => {
    if (!plan) return;

    dispatch(
      openInheritancePlanLoginDialog({
        walletId: plan.walletId,
        walletName: plan.walletName,
      }),
    );
  }, [plan]);

  useEffect(
    () => () => {
      dispatch(clearInheritancePlanDetails);
    },
    [],
  );

  return useMemoReturn({
    plan,
    onBack,
    onUnlock,
    planDetails,
  });
};
