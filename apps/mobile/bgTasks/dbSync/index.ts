import React, { useCallback } from 'react';

import { syncAllDb, addListeners, removeListeners } from './helper';
import { useFocusEffect } from 'expo-router';

export const DatabaseListener: React.FC = () => {
  useFocusEffect(
    useCallback(() => {
      syncAllDb();
      addListeners();

      return () => {
        removeListeners();
      };
    }, []),
  );

  return null;
};
