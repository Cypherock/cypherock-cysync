import { IAccount } from '@cypherock/db-interfaces';
import { useEffect, useRef } from 'react';

import { openSendDialog, openSignMessageDialog } from '~/actions';
import { useAppDispatch, useAppSelector, selectWallets } from '~/store';
import logger from '~/utils/logger';

import { useWidget } from '../context/WidgetProvider';
import { WIDGET_SUPPORTED_METHODS } from '../context/types';

interface UseWidgetRequestsParams {
  webviewRef: React.RefObject<any>;
  selectedAccount: IAccount;
  isActive: boolean; // Only poll when widget is active
}

const POLL_INTERVAL_MS = 100; // Poll every 100ms

// Methods that should open SendDialog
const SEND_METHODS = [
  WIDGET_SUPPORTED_METHODS.ETH_SEND_TRANSACTION,
  WIDGET_SUPPORTED_METHODS.ETH_SIGN_TRANSACTION,
];

// Methods that should open SignMessageDialog
const SIGN_METHODS = [
  WIDGET_SUPPORTED_METHODS.ETH_SIGN,
  WIDGET_SUPPORTED_METHODS.PERSONAL_SIGN,
  WIDGET_SUPPORTED_METHODS.ETH_SIGN_TYPED_DATA,
  WIDGET_SUPPORTED_METHODS.ETH_SIGN_TYPED_DATA_V4,
];

export function useWidgetRequests({
  webviewRef,
  selectedAccount,
  isActive,
}: UseWidgetRequestsParams) {
  const dispatch = useAppDispatch();
  const {
    setPendingRequest,
    callRequestData,
    approveCallRequest,
    rejectCallRequest,
  } = useWidget();
  const { wallets } = useAppSelector(selectWallets);
  const hasDispatchedDialogRef = useRef(false);

  useEffect(() => {
    if (!isActive) return undefined;

    const webview = webviewRef.current;
    if (!webview) return undefined;
    let isMounted = true;

    const pollInterval = setInterval(async () => {
      // Skip polling if component has unmounted
      if (!isMounted) return;

      try {
        // Check for pending requests in webview
        const pendingRequest = await webview.executeJavaScript(`
          (function() {
            if (window.widgetPendingRequests && window.widgetPendingRequests.length > 0) {
              const request = window.widgetPendingRequests.shift();
              return request;
            }
            return null;
          })();
        `);
        if (!isMounted) return;

        if (pendingRequest) {
          logger.info('WidgetRequests: Found pending request', {
            id: pendingRequest.id,
            method: pendingRequest.method,
          });

          setPendingRequest({
            id: pendingRequest.id,
            method: pendingRequest.method,
            params: pendingRequest.params,
          });
        }
      } catch (error) {
        // Ignore polling errors (webview might not be ready)
        // This is expected during initialization
      }
    }, POLL_INTERVAL_MS);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [webviewRef, isActive, setPendingRequest]);

  /**
   * When a request appears in context, dispatch the appropriate dialog
   * This mirrors WalletConnect's useEffect pattern
   */
  useEffect(() => {
    // Only dispatch once per request
    if (!callRequestData || hasDispatchedDialogRef.current) {
      return;
    }

    hasDispatchedDialogRef.current = true;

    logger.info('WidgetRequests: Dispatching dialog for request', {
      id: callRequestData.id,
      method: callRequestData.method,
    });

    // Handle transaction methods
    if (SEND_METHODS.includes(callRequestData.method as any)) {
      const txnParams = callRequestData.params[0];

      logger.info('WidgetRequests: Opening SendDialog', {
        to: txnParams?.to,
        value: txnParams?.value,
      });

      const wallet = wallets.find(w => w.__id === selectedAccount.walletId);

      if (!wallet) {
        logger.error('WidgetRequests: Could not find wallet for account', {
          accountId: selectedAccount.__id,
          walletId: selectedAccount.walletId,
        });
        return;
      }

      const p2pRequestType =
        callRequestData.method === WIDGET_SUPPORTED_METHODS.ETH_SIGN_TRANSACTION
          ? 'SIGN_ONLY'
          : 'SIGN_AND_SEND';

      logger.info('WidgetRequests: Opening SendDialog with P2P props', {
        account: selectedAccount.name,
        wallet: wallet.name,
        p2pRequestType,
      });

      dispatch(
        openSendDialog({
          walletId: selectedAccount.walletId,
          accountId: selectedAccount.__id,
          txnData: txnParams,
          disableAccountSelection: true,
          isP2PRequest: true,
          onP2PApprove: approveCallRequest,
          onP2PReject: rejectCallRequest,
          p2pRequestType,
        }),
      );
      return;
    }

    // Handle signature methods
    if (SIGN_METHODS.includes(callRequestData.method as any)) {
      logger.info('WidgetRequests: Opening SignMessageDialog for P2P widget', {
        method: callRequestData.method,
      });

      const wallet = wallets.find(w => w.__id === selectedAccount.walletId);

      if (!wallet) {
        logger.error('WidgetRequests: Could not find wallet for account', {
          accountId: selectedAccount.__id,
          walletId: selectedAccount.walletId,
        });
        return;
      }

      logger.info('WidgetRequests: Opening SignMessageDialog with P2P props', {
        account: selectedAccount.name,
        wallet: wallet.name,
      });

      dispatch(
        openSignMessageDialog({
          isP2PRequest: true,
          onP2PApprove: approveCallRequest,
          onP2PReject: rejectCallRequest,
          activeAccount: selectedAccount,
          activeWallet: wallet,
          callRequestData: callRequestData as any,
        }),
      );
      return;
    }

    // Unsupported method
    logger.error('WidgetRequests: Unsupported method', {
      method: callRequestData.method,
    });
  }, [
    callRequestData,
    dispatch,
    selectedAccount,
    wallets,
    approveCallRequest,
    rejectCallRequest,
  ]);

  useEffect(() => {
    if (!callRequestData) {
      hasDispatchedDialogRef.current = false;
    }
  }, [callRequestData]);
}
