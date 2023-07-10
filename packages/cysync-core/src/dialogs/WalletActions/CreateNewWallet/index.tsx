import React, { FC } from 'react';

import {
  WalletActionsProvider,
  useWalletActions,
} from '~/context/walletActions';

import { WalletActionsLayout } from '../WalletActionsLayout';

const CreateNewWallet: FC = () => {
  const { createNewWalletTabs } = useWalletActions();
  return <WalletActionsLayout tabs={createNewWalletTabs} />;
};

export const CreateNewWalletGuide: FC = () => (
  <WalletActionsProvider>
    <CreateNewWallet />
  </WalletActionsProvider>
);
