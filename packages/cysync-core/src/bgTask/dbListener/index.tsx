import React, { useEffect, useRef } from 'react';

import { useCurrency } from '~/context';

import {
  syncAllDb,
  addListeners,
  removeListeners,
  syncPriceDataDb,
  addPriceListeners,
  removePriceListeners,
} from './helper';

export const DatabaseListener: React.FC = () => {
  const { currentCurrency } = useCurrency();
  const isFirstMount = useRef(true);

  useEffect(() => {
    syncAllDb(true, currentCurrency);
    addListeners();
    addPriceListeners(currentCurrency);
    isFirstMount.current = false;
    return () => {
      removePriceListeners();
      removeListeners();
    };
  }, []);

  useEffect(() => {
    if (isFirstMount.current) return undefined;
    const run = async () => {
      removePriceListeners();
      await syncPriceDataDb(currentCurrency);
      addPriceListeners(currentCurrency);
    };
    run();
    return removePriceListeners;
  }, [currentCurrency]);

  return null;
};
