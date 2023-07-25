import { BtcSupport } from '@cypherock/coin-support-btc';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { openWalletActionsDialog } from '~/actions';
import { useDevice } from '~/context';
import { DeviceTask, useDeviceTask } from '~/hooks';
import { AssetAllocation, MainAppLayout } from '~/pages/MainApp/Components';import { getDB } from '~/utils';

import { selectLanguage, useAppSelector } from '~/store';

export const Portfolio: FC = () => {
  const { strings } = useAppSelector(selectLanguage);
  const dispatch = useDispatch();

  const test: DeviceTask<void> = async connection => {
    if (!connection) return;
    dispatch(openWalletActionsDialog());
    const btcSupport = new BtcSupport();
    const observable = btcSupport.receive({
      db: getDB(),
      connection,
      walletId: '',
      accountId: '',
      coinId: '',
    });
    console.log({ observable });
  };

  useDeviceTask(test);

  return (
    <MainAppLayout title={strings.portfolio.title}>
      <AssetAllocation />
    </MainAppLayout>
  );
};
