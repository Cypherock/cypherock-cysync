import React, { useEffect, useRef } from 'react';

import { syncAllPriceHistories, syncAllPrices } from '@/actions';

const LATEST_PRICE_AUTO_RESYNC_INTERVAL = 1 * 60 * 1000;
const PRICE_HISTORY_AUTO_RESYNC_INTERVAL = 3 * 60 * 1000;

export const PriceSyncTask: React.FC = () => {
  const latestPriceTimeoutRef = useRef<NodeJS.Timeout>();
  const priceHistoryTimeoutRef = useRef<NodeJS.Timeout>();
  const { currentCurrency } = useAppSelector(selectCurrency);
  const currencyRef = useRef(currentCurrency);

  useEffect(() => {
    currencyRef.current = currentCurrency;
  }, [currentCurrency]);

  const clearTimers = () => {
    if (latestPriceTimeoutRef.current) {
      clearTimeout(latestPriceTimeoutRef.current);
      latestPriceTimeoutRef.current = undefined;
    }

    if (priceHistoryTimeoutRef.current) {
      clearTimeout(priceHistoryTimeoutRef.current);
      priceHistoryTimeoutRef.current = undefined;
    }
  };

  const startSyncingLatestPrice = async () => {
    await syncAllPrices(currencyRef.current);
    latestPriceTimeoutRef.current = setTimeout(
      startSyncingLatestPrice,
      LATEST_PRICE_AUTO_RESYNC_INTERVAL,
    );
  };

  const startSyncingPriceHistory = async () => {
    await syncAllPriceHistories(currencyRef.current);
    priceHistoryTimeoutRef.current = setTimeout(
      startSyncingPriceHistory,
      PRICE_HISTORY_AUTO_RESYNC_INTERVAL,
    );
  };

  useEffect(() => {
    if (!__DEV__) {
      startSyncingLatestPrice();
      startSyncingPriceHistory();
    }

    return () => {
      clearTimers();
    };
  }, [currentCurrency]);

  return null;
};
