import { ReactComponentLike } from 'prop-types';
import React from 'react';

import { DialogName } from '~/store';

import { WalletSyncError } from './WalletSyncError';

export const dialogs: Record<DialogName, ReactComponentLike> = {
  addAccount: () => <div>Test</div>,
  walletSyncError: WalletSyncError,
};
