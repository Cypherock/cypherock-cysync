import React, { useEffect, useRef } from 'react';

import { syncAllPrices } from '~/actions';

const AUTO_RESYNC_INTERVAL = 1 * 60 * 1000;

export const PriceSyncTask: React.FC = () => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const startSyncing = async () => {
    await syncAllPrices();
    timeoutRef.current = setTimeout(startSyncing, AUTO_RESYNC_INTERVAL);
  };

  useEffect(() => {
    startSyncing();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return null;
};
