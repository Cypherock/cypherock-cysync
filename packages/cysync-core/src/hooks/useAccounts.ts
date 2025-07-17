import { BtcIdMap } from '@cypherock/coins';
import { createSelector } from '@reduxjs/toolkit';
import { useMemo } from 'react';

import {
  selectLastConnectedFirmware,
  selectUnHiddenAccounts,
  useAppSelector,
} from '~/store';

const selector = createSelector(
  [selectUnHiddenAccounts, selectLastConnectedFirmware],
  ({ accounts }, { isFirmwareBtcOnly }) => ({
    accounts,
    isFirmwareBtcOnly,
  }),
);

export const useAccounts = () => {
  const { accounts, isFirmwareBtcOnly } = useAppSelector(selector);

  return useMemo(
    () =>
      isFirmwareBtcOnly
        ? accounts.filter(a => a.assetId === BtcIdMap.bitcoin)
        : accounts,
    [accounts, isFirmwareBtcOnly],
  );
};
