/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConnectionStatusType,
  SyncStatusType,
  Topbar as TopbarUI,
} from '@cypherock/cysync-ui';
import React, { FC, useMemo, useState } from 'react';

import { DeviceConnectionStatus, useDevice, useLockscreen } from '~/context';
import { useMediaQuery } from '~/hooks';
import {
  selectDiscreetMode,
  selectLanguage,
  toggleDiscreetMode,
  useAppDispatch,
  useAppSelector,
} from '~/store';

export const Topbar: FC<{ title: string }> = ({ title }) => {
  const dispatch = useAppDispatch();
  const lang = useAppSelector(selectLanguage);
  const discreetModeState = useAppSelector(selectDiscreetMode);
  const { connection } = useDevice();
  const { isLg, isXl } = useMediaQuery();
  const { isLocked, isPasswordSet, lock, isLockscreenLoading } =
    useLockscreen();

  const [haveNotifications, setHaveNotifications] = useState<boolean>(false);
  const [syncState, setSyncState] = useState<SyncStatusType>('syncronized');

  const connectionStates: Record<DeviceConnectionStatus, ConnectionStatusType> =
    {
      [DeviceConnectionStatus.CONNECTED]: 'connected',
      [DeviceConnectionStatus.INCOMPATIBLE]: 'error',
      [DeviceConnectionStatus.UNKNOWN_ERROR]: 'error',
    };

  const connectionState: ConnectionStatusType = useMemo(
    () => (connection ? connectionStates[connection.status] : 'disconnected'),
    [connection],
  );

  return (
    <TopbarUI
      size={isLg || isXl ? 'big' : 'small'}
      title={title}
      statusTexts={lang.strings.topbar.statusTexts}
      lock={lock}
      isLocked={isLocked}
      syncStatus={syncState}
      isPasswordSet={isPasswordSet}
      connectionStatus={connectionState}
      haveNotifications={haveNotifications}
      isDiscreetMode={discreetModeState.active}
      isLockscreenLoading={isLockscreenLoading}
      toggleDiscreetMode={() => dispatch(toggleDiscreetMode())}
    />
  );
};
