import { IAccount, IWallet } from '@cypherock/db-interfaces';
import React, { FC, ReactNode, useMemo } from 'react';

import { WalletConnectContext, useWalletConnect } from '~/context';

import { useWidget } from './WidgetProvider';

export interface WidgetWalletConnectBridgeProps {
  children: ReactNode;
  selectedAccount: IAccount;
  selectedWallet?: IWallet;
}

export const WidgetWalletConnectBridge: FC<WidgetWalletConnectBridgeProps> = ({
  children,
  selectedAccount,
  selectedWallet,
}) => {
  const widgetContext = useWidget();
  const walletConnectContext = useWalletConnect();

  /**
   * Create an effective context that either:
   * - Uses widget data (when widget has active request)
   * - Uses WalletConnect data (normal operation)
   * 
   * This allows both to coexist without conflicts.
   */
  const effectiveContext = useMemo(() => {
    // If widget has an active request, override WalletConnect values
    if (widgetContext.isActive && widgetContext.callRequestData) {
      return {
        ...walletConnectContext,
        // Override these specific values with widget data
        callRequestData: widgetContext.callRequestData,
        approveCallRequest: widgetContext.approveCallRequest,
        rejectCallRequest: widgetContext.rejectCallRequest,
        activeAccount: selectedAccount,
        activeWallet: selectedWallet,
        // Keep WalletConnect's other properties unchanged
        // This ensures features like connection state, metadata, etc. still work
      };
    }

    return walletConnectContext;
  }, [
    widgetContext.isActive,
    widgetContext.callRequestData,
    widgetContext.approveCallRequest,
    widgetContext.rejectCallRequest,
    walletConnectContext,
    selectedAccount,
    selectedWallet,
  ]);

  return (
    <WalletConnectContext.Provider value={effectiveContext as any}>
      {children}
    </WalletConnectContext.Provider>
  );
};