import {
  ConnectionStatusType,
  SyncStatusType,
  Topbar as TopbarUI,
  TopbarProps as TopbarUIProps,
} from '@cypherock/cysync-ui';
import { createSelector } from '@reduxjs/toolkit';
import React, { FC, useMemo } from 'react';

import { syncAllAccounts } from '~/actions';
import { DeviceConnectionStatus, useDevice, useLockscreen } from '~/context';
import {
  AccountSyncState,
  AccountSyncStateMap,
  selectAccountSync,
  selectDiscreetMode,
  selectLanguage,
  selectNotifications,
  toggleDiscreetMode,
  toggleNotification,
  useAppDispatch,
  useAppSelector,
} from '~/store';

const selector = createSelector(
  [selectLanguage, selectDiscreetMode, selectAccountSync, selectNotifications],
  (a, b, c, { isOpen, unreadTransactions }) => ({
    lang: a,
    discreetMode: b,
    accountSync: c,
    isNotificationOpen: isOpen,
    unreadTransactions,
  }),
);

const connectionStatesMap: Record<
  DeviceConnectionStatus,
  ConnectionStatusType
> = {
  [DeviceConnectionStatus.CONNECTED]: 'connected',
  [DeviceConnectionStatus.INCOMPATIBLE]: 'error',
  [DeviceConnectionStatus.BUSY]: 'error',
  [DeviceConnectionStatus.UNKNOWN_ERROR]: 'error',
};

const accountSyncMap: Record<AccountSyncState, SyncStatusType> = {
  [AccountSyncStateMap.syncing]: 'synchronizing',
  [AccountSyncStateMap.synced]: 'synchronized',
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
  const { lang, discreetMode, accountSync, unreadTransactions } =
    useAppSelector(selector);
  const { connection } = useDevice();
  const { isLocked, isPasswordSet, lock, isLockscreenLoading } =
    useLockscreen();
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

  const onNotificationClick = () => {
    dispatch(toggleNotification());
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
      haveNotifications={unreadTransactions > 0}
      onNotificationClick={onNotificationClick}
      isDiscreetMode={discreetMode.active}
      isLockscreenLoading={isLockscreenLoading}
      toggleDiscreetMode={() => dispatch(toggleDiscreetMode())}
      onSyncClick={onSyncClick}
      tooltipText={accountSync.syncError}
    />
  );
};

TopbarComponent.defaultProps = {
  icon: undefined,
  subTitle: undefined,
  tag: undefined,
};

export const Topbar = React.memo(TopbarComponent);
