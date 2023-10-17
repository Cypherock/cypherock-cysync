import {
  ConnectionStatusType,
  SyncStatusType,
  Topbar as TopbarUI,
  TopbarProps as TopbarUIProps,
} from '@cypherock/cysync-ui';
import { createSelector } from '@reduxjs/toolkit';
import React, { FC, useMemo, useState } from 'react';

import { syncAllAccounts } from '~/actions';
import { DeviceConnectionStatus, useDevice, useLockscreen } from '~/context';
import {
  AccountSyncState,
  AccountSyncStateMap,
  selectAccountSync,
  selectDiscreetMode,
  selectLanguage,
  toggleDiscreetMode,
  useAppDispatch,
  useAppSelector,
} from '~/store';

const selector = createSelector(
  [selectLanguage, selectDiscreetMode, selectAccountSync],
  (a, b, c) => ({
    lang: a,
    discreetMode: b,
    accountSync: c,
  }),
);

const connectionStatesMap: Record<
  DeviceConnectionStatus,
  ConnectionStatusType
> = {
  [DeviceConnectionStatus.CONNECTED]: 'connected',
  [DeviceConnectionStatus.INCOMPATIBLE]: 'error',
  [DeviceConnectionStatus.UNKNOWN_ERROR]: 'error',
};

const accountSyncMap: Record<AccountSyncState, SyncStatusType> = {
  [AccountSyncStateMap.syncing]: 'syncronizing',
  [AccountSyncStateMap.synced]: 'syncronized',
  [AccountSyncStateMap.failed]: 'error',
};

export interface TopbarProps {
  title: TopbarUIProps['title'];
  subTitle?: TopbarUIProps['subTitle'];
  icon?: TopbarUIProps['icon'];
  tag?: TopbarUIProps['tag'];
}

const TopbarComponent: FC<TopbarProps> = props => {
  const dispatch = useAppDispatch();
  const { lang, discreetMode, accountSync } = useAppSelector(selector);
  const { connection } = useDevice();
  const { isLocked, isPasswordSet, lock, isLockscreenLoading } =
    useLockscreen();

  const [haveNotifications] = useState<boolean>(false);
  const syncState = useMemo<SyncStatusType>(
    () => accountSyncMap[accountSync.syncState],
    [accountSync.syncState],
  );

  const connectionState: ConnectionStatusType = useMemo(
    () =>
      connection ? connectionStatesMap[connection.status] : 'disconnected',
    [connection],
  );

  const onSyncClick = () => {
    dispatch(syncAllAccounts());
  };

  return (
    <TopbarUI
      {...props}
      statusTexts={lang.strings.topbar.statusTexts}
      lock={lock}
      isLocked={isLocked}
      syncStatus={syncState}
      isPasswordSet={isPasswordSet}
      connectionStatus={connectionState}
      haveNotifications={haveNotifications}
      isDiscreetMode={discreetMode.active}
      isLockscreenLoading={isLockscreenLoading}
      toggleDiscreetMode={() => dispatch(toggleDiscreetMode())}
      onSyncClick={onSyncClick}
    />
  );
};

TopbarComponent.defaultProps = {
  icon: undefined,
  subTitle: undefined,
  tag: undefined,
};

export const Topbar = React.memo(TopbarComponent);
