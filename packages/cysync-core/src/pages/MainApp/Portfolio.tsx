/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useState } from 'react';
import {
  BlurOverlay,
  SyncStatusType,
  ConnectionStatusType,
  Topbar,
  Flex,
} from '@cypherock/cysync-ui';
import { selectLanguage, useAppSelector } from '~/store';
import { CreateNewWallet, WalletActionsDialogBox } from '../OnBoarding';

export const Portfolio: FC<{}> = () => {
  const lang = useAppSelector(selectLanguage);
  const [showWalletActionsDialogBox, setShowWalletActionsDialogBox] =
    useState(true);
  const [showCreateWalletDialogBox, setShowCreateWalletDialogBox] =
    useState<boolean>(false);
  const [showOnClose, setShowOnClose] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLock, setIsLock] = useState<boolean>(true);
  const [haveNotifications, setHaveNotifications] = useState<boolean>(false);
  const [syncState, setSyncState] = useState<SyncStatusType>('syncronized');
  const [connectionState, setConnectionState] =
    useState<ConnectionStatusType>('connected');

  return (
    <Flex height="screen" align="flex-start" $bgColor="sideBar">
      <Topbar
        title={lang.strings.portfolio.title}
        statusTexts={lang.strings.topbar.statusTexts}
        isVisible={isVisible}
        isLock={isLock}
        haveNotifications={haveNotifications}
        syncStatus={syncState}
        connectionStatus={connectionState}
      />
      {showWalletActionsDialogBox && (
        <BlurOverlay>
          <WalletActionsDialogBox
            setShowWalletActionsDialogBox={setShowWalletActionsDialogBox}
            setShowCreateWalletDialogBox={setShowCreateWalletDialogBox}
          />
        </BlurOverlay>
      )}

      {showCreateWalletDialogBox && (
        <BlurOverlay>
          <CreateNewWallet
            setShowCreateWalletDialogBox={setShowCreateWalletDialogBox}
            setShowOnClose={setShowOnClose}
            setShowWalletActionsDialogBox={setShowWalletActionsDialogBox}
            showOnClose={showOnClose}
          />
        </BlurOverlay>
      )}
    </Flex>
  );
};
