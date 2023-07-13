import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { keyValueStore } from '~/utils';

export const useOnboardingCheckpoint = () => {
  const location = useLocation();

  const updateCheckpoint = async () => {
    await keyValueStore.onboardingCheckpointPath.set(location.pathname);
  };

  useEffect(() => {
    updateCheckpoint();
  }, [location.pathname]);
};
