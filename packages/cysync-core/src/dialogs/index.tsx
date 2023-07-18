import { ReactComponentLike } from 'prop-types';
import React from 'react';

import { DialogName } from '~/store';

import { AddAccountGuide } from './AddAccountGuide';
import { ReceiveGuide } from './Receive';
import { CreateWalletGuide } from './CreateWalletGuide';
import { WalletActionsDialogBox } from './WalletActions';
import { WalletSyncError } from './WalletSyncError';

export const dialogs: Record<DialogName, ReactComponentLike> = {
  addAccount: () => <div>Test</div>,
  walletSyncError: WalletSyncError,
  walletActions: WalletActionsDialogBox,
  createWalletGuide: CreateWalletGuide,
  addAccountGuide: AddAccountGuide,
  receiveGuide: ReceiveGuide,
};
