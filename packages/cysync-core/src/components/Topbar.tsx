import {
  ConnectionStatusType,
  SyncStatusType,
  Topbar as TopbarUI,
} from '@cypherock/cysync-ui';
import { createSelector } from '@reduxjs/toolkit';
import React, { FC, ReactNode, useMemo, useCallback } from 'react';

import { openContactSupportDialog, syncAllAccounts } from '~/actions';
import { routes } from '~/constants';
import { DeviceConnectionStatus, useDevice, useLockscreen } from '~/context';
import { useNavigateTo } from '~/hooks';
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
  title: string;
  subTitle?: string;
  icon?: ReactNode;
  tag?: string;
  showIcon?: boolean;
  onIconClick?: () => void;
}

const TopbarComponent: FC<TopbarProps> = props => {
  const dispatch = useAppDispatch();
  const navigateTo = useNavigateTo();
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

  const onSyncClick = useCallback(() => {
    dispatch(syncAllAccounts());
  }, [dispatch]);

  const onNotificationClick = useCallback(() => {
    dispatch(toggleNotification());
  }, [dispatch]);

  const handleSettingsClick = useCallback(() => {
    navigateTo(routes.settings.path);
  }, [navigateTo]);

  const handleHelpClick = useCallback(() => {
    dispatch(openContactSupportDialog());
  }, [dispatch]);

  const handleToggleDiscreetMode = useCallback(() => {
    dispatch(toggleDiscreetMode());
  }, [dispatch]);

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
      toggleDiscreetMode={handleToggleDiscreetMode}
      onSyncClick={onSyncClick}
      tooltipText={accountSync.syncError}
      onHelpClick={handleHelpClick}
      onSettingsClick={handleSettingsClick}
    />
  );
};

TopbarComponent.defaultProps = {
  icon: undefined,
  subTitle: undefined,
  tag: undefined,
  showIcon: false,
  onIconClick: undefined,
};

export const Topbar = React.memo(TopbarComponent);
