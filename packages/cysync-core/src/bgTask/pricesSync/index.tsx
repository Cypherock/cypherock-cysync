import React, { useEffect, useRef } from 'react';

import { syncAllPriceHistories, syncAllPrices } from '~/actions';
import { useCurrency } from '~/context';

const LATEST_PRICE_AUTO_RESYNC_INTERVAL = 1 * 60 * 1000;
const PRICE_HISTORY_AUTO_RESYNC_INTERVAL = 5 * 60 * 1000;
const LATEST_PRICE_INITIAL_DELAY = 1000;
const PRICE_HISTORY_INITIAL_DELAY = 5 * 1000;

export const PriceSyncTask: React.FC = () => {
  const latestPriceTimeoutRef = useRef<NodeJS.Timeout>();
  const priceHistoryTimeoutRef = useRef<NodeJS.Timeout>();
  const { currentCurrency } = useCurrency();

  const startSyncingLatestPrice = async () => {
    await syncAllPrices(currentCurrency);
    latestPriceTimeoutRef.current = setTimeout(
      startSyncingLatestPrice,
      LATEST_PRICE_AUTO_RESYNC_INTERVAL,
    );
  };

  const startSyncingPriceHistory = async () => {
    await syncAllPriceHistories(currentCurrency);
    priceHistoryTimeoutRef.current = setTimeout(
      startSyncingPriceHistory,
      PRICE_HISTORY_AUTO_RESYNC_INTERVAL,
    );
  };

  useEffect(() => {
    if (latestPriceTimeoutRef.current)
      clearTimeout(latestPriceTimeoutRef.current);
    if (priceHistoryTimeoutRef.current)
      clearTimeout(priceHistoryTimeoutRef.current);

    if (window.cysyncEnv.IS_PRODUCTION === 'true') {
      latestPriceTimeoutRef.current = setTimeout(
        startSyncingLatestPrice,
        LATEST_PRICE_INITIAL_DELAY,
      );

      priceHistoryTimeoutRef.current = setTimeout(
        startSyncingPriceHistory,
        PRICE_HISTORY_INITIAL_DELAY,
      );
    }

    return () => {
      if (latestPriceTimeoutRef.current) {
        clearTimeout(latestPriceTimeoutRef.current);
      }

      if (priceHistoryTimeoutRef.current) {
        clearTimeout(priceHistoryTimeoutRef.current);
      }
    };
  }, [currentCurrency]);

  return null;
};
