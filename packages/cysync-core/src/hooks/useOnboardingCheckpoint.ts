import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { keyValueStore } from '~/utils';

import { routes } from '..';

export const useOnboardingCheckpoint = () => {
  const location = useLocation();

  const checkpointRoutes: string[] = [
    routes.onboarding.info.path,
    routes.onboarding.usage.path,
    routes.onboarding.terms.path,
    routes.onboarding.setPassword.path,
    routes.onboarding.cardTraining.path,
    routes.onboarding.deviceAuthentication.path,
    routes.onboarding.deviceDetection.path,
    routes.onboarding.emailAuth.path,
    routes.onboarding.joystickTraining.path,
  ];

  const updateCheckpoint = async () => {
    await keyValueStore.onboardingCheckpointPath.set(location.pathname);
  };

  useEffect(() => {
    if (checkpointRoutes.includes(location.pathname)) updateCheckpoint();
  }, [location.pathname]);
};
