import { useEffect } from 'react';

import { keyValueStore } from '~/utils';

export const useOnboardingCheckpoint = (path: string) => {
  const updateCheckpoint = async () => {
    await keyValueStore.checkpointPath.set(path);
  };
  useEffect(() => {
    updateCheckpoint();
  }, []);
};
