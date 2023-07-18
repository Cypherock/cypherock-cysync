/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConnectionStatusType,
  SyncStatusType,
  Topbar,
} from '@cypherock/cysync-ui';
import React, { FC, useEffect, useState } from 'react';

import { DeviceConnectionStatus, useDevice, useLockscreen } from '~/context';
import { AssetAllocation } from '~/pages/MainApp/Components/AssetAllocation';
import {
  selectDiscreetMode,
  selectLanguage,
  toggleDiscreetMode,
  useAppDispatch,
  useAppSelector,
} from '~/store';

export const Portfolio: FC = () => {
  const dispatch = useAppDispatch();
  const lang = useAppSelector(selectLanguage);
  const discreetModeState = useAppSelector(selectDiscreetMode);
  const { connection } = useDevice();
  const { isLocked, isPasswordSet, lock, isLockscreenLoading } =
    useLockscreen();

  const [haveNotifications, setHaveNotifications] = useState<boolean>(false);
  const [syncState, setSyncState] = useState<SyncStatusType>('syncronized');
  const [connectionState, setConnectionState] =
    useState<ConnectionStatusType>('connected');

  useEffect(() => {
    if (!connection) setConnectionState('disconnected');
    else {
      if (connection.status === DeviceConnectionStatus.CONNECTED) {
        setConnectionState('connected');
      }
      if (connection.status === DeviceConnectionStatus.INCOMPATIBLE) {
        setConnectionState('error');
      }
      if (connection.status === DeviceConnectionStatus.UNKNOWN_ERROR) {
        setConnectionState('error');
      }
    }
  }, [connection]);

  return (
    <>
      <Topbar
        title={lang.strings.portfolio.title}
        statusTexts={lang.strings.topbar.statusTexts}
        isDiscreetMode={discreetModeState.active}
        toggleDiscreetMode={() => dispatch(toggleDiscreetMode())}
        haveNotifications={haveNotifications}
        syncStatus={syncState}
        connectionStatus={connectionState}
        isLocked={isLocked}
        isPasswordSet={isPasswordSet}
        lock={lock}
        isLockscreenLoading={isLockscreenLoading}
      />
      <AssetAllocation />
    </>
  );
};
