import React, { useEffect, useRef } from 'react';

import { syncAllPriceHistories, syncAllPrices } from '~/actions';

const LATEST_PRICE_AUTO_RESYNC_INTERVAL = 1 * 60 * 1000;
const PRICE_HISTORY_AUTO_RESYNC_INTERVAL = 5 * 60 * 1000;

export const PriceSyncTask: React.FC = () => {
  const latestPriceTimeoutRef = useRef<NodeJS.Timeout>();
  const priceHistoryTimeoutRef = useRef<NodeJS.Timeout>();

  const startSyncingLatestPrice = async () => {
    await syncAllPrices();
    latestPriceTimeoutRef.current = setTimeout(
      startSyncingLatestPrice,
      LATEST_PRICE_AUTO_RESYNC_INTERVAL,
    );
  };

  const startSyncingPriceHistory = async () => {
    await syncAllPriceHistories();
    priceHistoryTimeoutRef.current = setTimeout(
      startSyncingPriceHistory,
      PRICE_HISTORY_AUTO_RESYNC_INTERVAL,
    );
  };

  useEffect(() => {
    if (window.cysyncEnv.IS_PRODUCTION === 'true') {
      startSyncingLatestPrice();
      startSyncingPriceHistory();
    }

    return () => {
      if (latestPriceTimeoutRef.current) {
        clearTimeout(latestPriceTimeoutRef.current);
      }

      if (priceHistoryTimeoutRef.current) {
        clearTimeout(priceHistoryTimeoutRef.current);
      }
    };
  }, []);

  return null;
};
