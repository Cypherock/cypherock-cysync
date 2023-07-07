/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConnectionStatusType,
  SyncStatusType,
  Topbar,
  Flex,
} from '@cypherock/cysync-ui';
import React, { FC, useState } from 'react';

import { CreateNewWalletProvider } from '~/context/createNewWallet';
import { AssetAllocation } from '~/pages/MainApp/Components/AssetAllocation';
import { selectLanguage, useAppSelector } from '~/store';

import { CreateNewWallet, WalletActionsDialogBox } from '../OnBoarding';

export const Portfolio: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const [showOnClose, setShowOnClose] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLock, setIsLock] = useState<boolean>(true);
  const [haveNotifications, setHaveNotifications] = useState<boolean>(false);
  const [syncState, setSyncState] = useState<SyncStatusType>('syncronized');
  const [connectionState, setConnectionState] =
    useState<ConnectionStatusType>('connected');

  return (
    <CreateNewWalletProvider>
      <Topbar
        title={lang.strings.portfolio.title}
        statusTexts={lang.strings.topbar.statusTexts}
        isVisible={isVisible}
        isLock={isLock}
        haveNotifications={haveNotifications}
        syncStatus={syncState}
        connectionStatus={connectionState}
      />
      <WalletActionsDialogBox />
      <CreateNewWallet
        showOnClose={showOnClose}
        setShowOnClose={setShowOnClose}
      />
      <AssetAllocation />
    </CreateNewWalletProvider>
  );
};
