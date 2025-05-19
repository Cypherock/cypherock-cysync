import { assert } from '@cypherock/cysync-utils';
import { useCallback } from 'react';

import { inheritancePlanService } from '~/services';
import { AuthTokenConfig } from '~/services/utils';
import {
  IInheritancePlanDetails,
  reminderPeriodStringToNumMap,
  updateInheritancePlanDetails,
  useAppDispatch,
} from '~/store';

export const useUpdatePlanDetails = (props: {
  authTokenConfig?: AuthTokenConfig;
}) => {
  const dispatch = useAppDispatch();

  const fetchAndUpdatePlan = useCallback(async () => {
    assert(props.authTokenConfig, 'No authTokenConfig provided');
    const result = await inheritancePlanService.getPlan({
      authTokenConfig: props.authTokenConfig,
    });

    if (result.error) {
      throw result.error;
    }

    const activationDate =
      result.result.subscription?.[0]?.activationDate ??
      new Date().toISOString();

    const expiryDate =
      result.result.subscription?.[0]?.order?.expiryDate ??
      Date.now() + 2 * 365 * 24 * 60 * 60 * 1000;

    const planDetails: IInheritancePlanDetails = {
      walletId: result.result.wallet,
      name: result.result.fullName ?? '',
      nominee:
        result.result.nominee?.map(n => ({
          name: n.name ?? '',
          email: n.email ?? '',
          alternateEmail: n.alternateEmail ?? '',
        })) ?? [],
      ...(result.result.executor !== undefined
        ? {
            executor: {
              name: result.result.executor.name ?? '',
              email: result.result.executor.email ?? '',
              alternateEmail: result.result.executor.alternateEmail ?? '',
            },
          }
        : {}),
      owner: {
        name: result.result.owner?.name ?? '',
        email: result.result.owner?.email ?? '',
        alternateEmail: result.result.owner?.alternateEmail ?? '',
      },
      activationDate: new Date(activationDate).getTime(),
      expiryDate: new Date(expiryDate).getTime(),
      reminderPeriod:
        reminderPeriodStringToNumMap[
          result.result.emailConfig?.frequency ?? ''
        ],
    };

    dispatch(
      updateInheritancePlanDetails({
        walletId: planDetails.walletId,
        planDetails,
      }),
    );
  }, [props, dispatch]);

  return { fetchAndUpdatePlan };
};
