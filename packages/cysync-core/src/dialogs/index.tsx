import { ReactComponentLike } from 'prop-types';
import React from 'react';

import { DialogName } from '~/store';

import { CreateNewWalletGuide } from './WalletActions/CreateNewWallet';
import { ImportWalletGuide } from './WalletActions/ImportWallet';
import { WalletCreation } from './WalletCreation';
import { WalletSyncError } from './WalletSyncError';

export const dialogs: Record<DialogName, ReactComponentLike> = {
  addAccount: () => <div>Test</div>,
  walletSyncError: WalletSyncError,
  walletCreation: WalletCreation,
  createWalletGuide: CreateNewWalletGuide,
  importWalletGuide: ImportWalletGuide,
};
