import { BtcIdMap } from '@cypherock/coins';
import { createSelector } from '@reduxjs/toolkit';
import { useMemo } from 'react';

import {
  selectLastConnectedFirmware,
  selectTransactions,
  useAppSelector,
} from '~/store';

const selector = createSelector(
  [selectTransactions, selectLastConnectedFirmware],
  ({ transactions }, { isFirmwareBtcOnly }) => ({
    transactions,
    isFirmwareBtcOnly,
  }),
);

export const useTransactions = () => {
  const { transactions, isFirmwareBtcOnly } = useAppSelector(selector);

  return useMemo(
    () =>
      isFirmwareBtcOnly
        ? transactions.filter(t => t.assetId === BtcIdMap.bitcoin)
        : transactions,
    [transactions, isFirmwareBtcOnly],
  );
};
