/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConnectionStatusType,
  SyncStatusType,
  Topbar,
  Flex,
  Container,
} from '@cypherock/cysync-ui';
import React, { FC, useEffect, useState } from 'react';

import { openWalletActionsDialog } from '~/actions';
import { AssetAllocation, SideBar } from '~/pages/MainApp/Components';
import {
  openDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';

export const Portfolio: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const [showOnClose, setShowOnClose] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLock, setIsLock] = useState<boolean>(true);
  const [haveNotifications, setHaveNotifications] = useState<boolean>(false);
  const [syncState, setSyncState] = useState<SyncStatusType>('syncronized');
  const [connectionState, setConnectionState] =
    useState<ConnectionStatusType>('connected');
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(openWalletActionsDialog());
  }, []);

  return (
    <Container height="screen" display="flex">
      <SideBar />
      <Flex direction="column" grow={1} $alignSelf="start">
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
      </Flex>
    </Container>
  );
};
