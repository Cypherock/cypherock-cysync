import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useMemo,
  ReactNode,
  FC,
} from 'react';

import logger from '~/utils/logger';

import { WidgetCallRequestData, WidgetContextInterface } from './types';

/**
 * Widget Context Provider
 * 
 * This provider manages the state for widget requests (transactions/signatures).
 * It stores pending requests and provides methods to approve/reject them.
 * 
 * The WidgetWalletConnectBridge component reads from this context and injects
 * the data into WalletConnect context, allowing dialogs to work seamlessly.
 */

export const WidgetContext = createContext<WidgetContextInterface>({
  callRequestData: null,
  approveCallRequest: () => {},
  rejectCallRequest: () => {},
  isActive: false,
});

export interface WidgetProviderProps {
  children: ReactNode;
  webviewRef?: React.RefObject<any>;
}

export const WidgetProvider: FC<WidgetProviderProps> = ({
  children,
  webviewRef,
}) => {
  // Current pending request (will be injected into WalletConnect context by bridge)
  const [callRequestData, setCallRequestData] =
    useState<WidgetCallRequestData | null>(null);

  // Store the current request ID so we can resolve the correct promise in webview
  const currentRequestIdRef = useRef<string | null>(null);

  /**
   * Called by dialogs when transaction/signature completes successfully
   * Sends the result back to the webview to resolve the widget's promise
   */
  const approveCallRequest = useCallback(
    (result: string) => {
      if (!callRequestData || !currentRequestIdRef.current) {
        logger.warn('WidgetProvider: No pending request to approve', {
          hasCallRequestData: !!callRequestData,
          hasRequestId: !!currentRequestIdRef.current,
        });
        return;
      }

      const requestId = currentRequestIdRef.current;

      logger.info('WidgetProvider: Approving widget request', {
        requestId,
        method: callRequestData.method,
        resultPreview: result.substring(0, 20) + '...',
      });

      // Send result back to webview via executeJavaScript
      if (webviewRef?.current) {
        try {
          // Escape single quotes in result to prevent JavaScript injection
          const safeResult = result.replace(/'/g, "\\'");
          
          webviewRef.current
            .executeJavaScript(
              `
              (function() {
                if (window.resolveWidgetRequest) {
                  window.resolveWidgetRequest('${requestId}', '${safeResult}');
                  return true;
                } else {
                  console.error('[Widget] resolveWidgetRequest not found on window');
                  return false;
                }
              })();
            `,
            )
            .then((success: boolean) => {
              if (success) {
                logger.info(
                  'WidgetProvider: Successfully sent result to webview',
                  { requestId },
                );
              } else {
                logger.error(
                  'WidgetProvider: resolveWidgetRequest function not available in webview',
                  { requestId },
                );
              }
            })
            .catch((error: Error) => {
              logger.error(
                'WidgetProvider: Error executing JavaScript in webview',
                {
                  error: error.message,
                  requestId,
                },
              );
            });
        } catch (error) {
          logger.error('WidgetProvider: Error approving request', {
            error: (error as Error).message,
            requestId,
          });
        }
      } else {
        logger.error('WidgetProvider: Webview ref not available', {
          requestId,
        });
      }

      // Clear pending request
      setCallRequestData(null);
      currentRequestIdRef.current = null;
    },
    [callRequestData, webviewRef],
  );

  /**
   * Called by dialogs when user cancels or request fails
   * Rejects the widget's promise in the webview
   */
  const rejectCallRequest = useCallback(
    (reason?: string) => {
      if (!callRequestData || !currentRequestIdRef.current) {
        logger.warn('WidgetProvider: No pending request to reject');
        return;
      }

      const requestId = currentRequestIdRef.current;

      logger.info('WidgetProvider: Rejecting widget request', {
        requestId,
        method: callRequestData.method,
        reason: reason || 'User rejected',
      });

      // Send rejection back to webview
      if (webviewRef?.current) {
        try {
          const errorMessage = (reason || 'User rejected the request').replace(
            /'/g,
            "\\'",
          );
          
          webviewRef.current.executeJavaScript(`
            (function() {
              if (window.rejectWidgetRequest) {
                window.rejectWidgetRequest('${requestId}', '${errorMessage}');
                return true;
              } else {
                console.error('[Widget] rejectWidgetRequest not found on window');
                return false;
              }
            })();
          `);
        } catch (error) {
          logger.error('WidgetProvider: Error rejecting request', {
            error: (error as Error).message,
            requestId,
          });
        }
      }

      // Clear pending request
      setCallRequestData(null);
      currentRequestIdRef.current = null;
    },
    [callRequestData, webviewRef],
  );

  /**
   * Public method to set a new pending request
   * Called by useWidgetRequests hook when polling detects a new request from webview
   */
  const setPendingRequest = useCallback(
    (request: WidgetCallRequestData | null) => {
      if (request) {
        logger.info('WidgetProvider: Setting pending request', {
          requestId: request.id,
          method: request.method,
        });
        currentRequestIdRef.current = request.id;
      } else {
        logger.info('WidgetProvider: Clearing pending request');
        currentRequestIdRef.current = null;
      }
      setCallRequestData(request);
    },
    [],
  );

  const contextValue = useMemo(
    () => ({
      callRequestData,
      approveCallRequest,
      rejectCallRequest,
      isActive: callRequestData !== null,
      // Internal method for useWidgetRequests hook
      setPendingRequest,
    }),
    [callRequestData, approveCallRequest, rejectCallRequest, setPendingRequest],
  );

  return (
    <WidgetContext.Provider value={contextValue as any}>
      {children}
    </WidgetContext.Provider>
  );
};

/**
 * Hook to access widget context
 */
export function useWidget(): WidgetContextInterface & {
  setPendingRequest: (request: WidgetCallRequestData | null) => void;
} {
  return useContext(WidgetContext) as any;
}