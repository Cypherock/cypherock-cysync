import React, { FC } from 'react';

import {
  WalletActionsProvider,
  useWalletActions,
} from '~/context/walletActions';

import { WalletActionsLayout } from '../WalletActionsLayout';

const ImportWallet: FC = () => {
  const { importWalletTabs } = useWalletActions();
  return <WalletActionsLayout tabs={importWalletTabs} />;
};

export const ImportWalletGuide: FC = () => (
  <WalletActionsProvider>
    <ImportWallet />
  </WalletActionsProvider>
);
