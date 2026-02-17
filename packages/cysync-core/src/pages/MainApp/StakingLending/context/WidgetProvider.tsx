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

export const WidgetContext = createContext<WidgetContextInterface>({
  callRequestData: null,
  approveCallRequest: () => {
    /* default no-op */
  },
  rejectCallRequest: () => {
    /* default no-op */
  },
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
  const [callRequestData, setCallRequestData] =
    useState<WidgetCallRequestData | null>(null);

  const currentRequestIdRef = useRef<string | null>(null);

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
        resultPreview: `${result.substring(0, 20)}...`,
      });

      if (webviewRef?.current) {
        try {
          const safeResult = JSON.stringify(result);
          const safeRequestId = JSON.stringify(requestId);

          webviewRef.current
            .executeJavaScript(
              `
              (function() {
                if (window.resolveWidgetRequest) {
                  window.resolveWidgetRequest(${safeRequestId}, ${safeResult});
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
        reason: reason ?? 'User rejected',
      });

      if (webviewRef?.current) {
        try {
          const safeErrorMessage = JSON.stringify(
            reason ?? 'User rejected the request',
          );
          const safeRequestId = JSON.stringify(requestId);

          webviewRef.current.executeJavaScript(`
            (function() {
              if (window.rejectWidgetRequest) {
                window.rejectWidgetRequest(${safeRequestId}, ${safeErrorMessage});
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

export function useWidget(): WidgetContextInterface & {
  setPendingRequest: (request: WidgetCallRequestData | null) => void;
} {
  return useContext(WidgetContext) as any;
}

WidgetProvider.defaultProps = {
  webviewRef: undefined,
};
