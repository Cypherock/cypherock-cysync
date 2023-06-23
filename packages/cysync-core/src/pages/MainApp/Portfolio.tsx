/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useState } from 'react';
import { Topbar } from '@cypherock/cysync-ui';
import { selectLanguage, useAppSelector } from '~/store';

type SyncState = 'syncronized' | 'syncronizing' | 'syncError';
type ConnectionState = 'connected' | 'connectionError' | 'disconnected';

export const Portfolio: FC<{}> = () => {
  const lang = useAppSelector(selectLanguage);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLock, setIsLock] = useState<boolean>(true);
  const [haveNotifications, setHaveNotifications] = useState<boolean>(false);
  const [syncState, setSyncState] = useState<SyncState>('syncronized');
  const [connectionState, setConnectionState] =
    useState<ConnectionState>('connected');
  return (
    <Topbar
      title={lang.strings.portfolio.topbar.title}
      statuses={lang.strings.portfolio.topbar.statuses}
      isVisible={isVisible}
      isLock={isLock}
      haveNotifications={haveNotifications}
      syncState={syncState}
      connectionState={connectionState}
    />
  );
};
