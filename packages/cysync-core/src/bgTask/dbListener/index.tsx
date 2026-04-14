import React, { useEffect } from 'react';

import { useCurrency } from '~/context';

import { syncAllDb, addListeners, removeListeners } from './helper';

export const DatabaseListener: React.FC = () => {
  const { currentCurrency } = useCurrency();

  useEffect(() => {
    syncAllDb(true, currentCurrency);
    addListeners();
    return removeListeners;
  }, []);

  return null;
};
