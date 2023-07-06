import { FullPageLoader } from '@cypherock/cysync-ui';
import React, { useEffect, useState } from 'react';

import { routes } from '~/constants';
import { useNavigateTo } from '~/hooks';
import { keyValueStore } from '~/utils';

import { PermissionSetupDialog } from './PermissionDialog';

export const PermissionSetup: React.FC = () => {
  const [isLinuxSetupRequired, setIsLinuxSetupRequired] = useState<
    boolean | undefined
  >();
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<
    boolean | undefined
  >();
  const navigateTo = useNavigateTo();

  const toNextPage = async (onboardingDone: boolean, withDelay?: boolean) => {
    if (onboardingDone) {
      navigateTo(routes.portfolio.path, withDelay ? 500 : undefined);
    } else {
      const path =
        (await keyValueStore.onboardingCheckpointPath.get()) ??
        routes.onboarding.info.path;
      navigateTo(path, withDelay ? 500 : undefined);
    }
  };

  const getStates = async () => {
    const onboardingDone = await keyValueStore.isOnboardingCompleted.get();
    setIsOnboardingCompleted(onboardingDone);

    const linuxSetupRequired =
      window.cysyncEnv.OS === 'linux' &&
      !(await keyValueStore.isLinuxPermissionSetupDone.get());

    if (!linuxSetupRequired) {
      toNextPage(onboardingDone, true);
    } else {
      setIsLinuxSetupRequired(linuxSetupRequired);
    }
  };

  const onPermissionCompleted = async () => {
    await keyValueStore.isLinuxPermissionSetupDone.set(true);
    toNextPage(isOnboardingCompleted ?? false);
  };

  useEffect(() => {
    getStates();
  }, []);

  if (isLinuxSetupRequired) {
    return <PermissionSetupDialog onComplete={onPermissionCompleted} />;
  }

  return <FullPageLoader />;
};
