import React, { useEffect, useState } from 'react';
import { FullPageLoader } from '@cypherock/cysync-ui';
import { keyValueStore } from '~/utils';
import { useNavigateTo } from '~/hooks';
import { routes } from '~/constants';
import { PermissionSetupDialog } from './PermissionDialog';

export const PermissionSetup: React.FC = () => {
  const [isLinuxSetupRequired, setIsLinuxSetupRequired] = useState<
    boolean | undefined
  >();
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<
    boolean | undefined
  >();
  const navigateTo = useNavigateTo();

  const toNextPage = (onboardingDone: boolean, withDelay?: boolean) => {
    if (onboardingDone) {
      navigateTo(routes.portfolio.path, withDelay ? 500 : undefined);
    } else {
      navigateTo(routes.onboarding.info.path, withDelay ? 500 : undefined);
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
