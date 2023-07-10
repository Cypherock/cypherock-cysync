/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConnectionStatusType,
  SyncStatusType,
  Topbar,
} from '@cypherock/cysync-ui';
import React, { FC, useEffect, useState } from 'react';
import { openWalletCreationDialog } from '~/actions';

import { AssetAllocation } from '~/pages/MainApp/Components/AssetAllocation';
import { selectLanguage, useAppDispatch, useAppSelector } from '~/store';

export const Portfolio: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLock, setIsLock] = useState<boolean>(true);
  const [haveNotifications, setHaveNotifications] = useState<boolean>(false);
  const [syncState, setSyncState] = useState<SyncStatusType>('syncronized');
  const [connectionState, setConnectionState] =
    useState<ConnectionStatusType>('connected');

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(openWalletCreationDialog());
  }, []);
  return (
    <>
      <Topbar
        title={lang.strings.portfolio.title}
        statusTexts={lang.strings.topbar.statusTexts}
        isVisible={isVisible}
        isLock={isLock}
        haveNotifications={haveNotifications}
        syncStatus={syncState}
        connectionStatus={connectionState}
      />
      <AssetAllocation />
    </>
  );
};
