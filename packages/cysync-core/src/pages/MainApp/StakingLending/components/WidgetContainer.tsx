import { Container, Flex, Typography } from '@cypherock/cysync-ui';
import { IAccount } from '@cypherock/db-interfaces';
import React, { useEffect, useState } from 'react';

export interface WidgetContainerProps {
  selectedAccount: IAccount;
  webviewRef: React.RefObject<any>;
  widgetUrl?: string;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  selectedAccount,
  webviewRef,
  widgetUrl = 'https://9716b016517de6f71e42f74b.p2p.org',
}) => {
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview) return () => undefined;

    const handleDomReady = async () => {
      setStatus('Injecting wallet...');

      try {
        await webview.executeJavaScript(`
          (function() {
            // Pending requests array - React polls this
            window.widgetPendingRequests = [];
            
            // Request ID counter for uniqueness
            let requestIdCounter = 0;
            
            // Storage for promise resolvers/rejectors
            // Key: requestId, Value: { resolve, reject }
            const pendingPromises = new Map();

            /**
             * Resolve a request (called by React when dialog completes)
             */
            window.resolveWidgetRequest = function(requestId, result) {
              
              const promise = pendingPromises.get(requestId);
              if (promise) {
                promise.resolve(result);
                pendingPromises.delete(requestId);
              } else {
                console.error('[Widget] No pending promise found for request:', requestId);
              }
            };

            /**
             * Reject a request (called by React when user cancels)
             */
            window.rejectWidgetRequest = function(requestId, errorMessage) {
              
              const promise = pendingPromises.get(requestId);
              if (promise) {
                promise.reject(new Error(errorMessage));
                pendingPromises.delete(requestId);
              } else {
                console.error('[Widget] No pending promise found for request:', requestId);
              }
            };

            /**
             * EIP-1193 Ethereum Provider
             */
            window.ethereum = {
              isMetaMask: false,
              isCypherock: true,
              chainId: '0x1', // Ethereum mainnet
              selectedAddress: '${selectedAccount.xpubOrAddress}',
              
              /**
               * Main request method - all wallet interactions go through this
               */
              request: async function(args) {
                
                // Handle account queries
                if (args.method === 'eth_accounts' || args.method === 'eth_requestAccounts') {
                  const accounts = ['${selectedAccount.xpubOrAddress}'];
                  return accounts;
                }
                
                // Handle chain ID query
                if (args.method === 'eth_chainId') {
                  return '0x1';
                }
                
                // Handle transactions and signatures
                const handledMethods = [
                  'eth_sendTransaction',
                  'eth_signTransaction',
                  'eth_sign',
                  'personal_sign',
                  'eth_signTypedData',
                  'eth_signTypedData_v4'
                ];
                
                if (handledMethods.includes(args.method)) {
                  return new Promise((resolve, reject) => {
                    // Generate unique request ID
                    const requestId = 'widget-req-' + (++requestIdCounter) + '-' + Date.now();
                    
                    // Store the promise resolvers
                    pendingPromises.set(requestId, { resolve, reject });
                    
                    // Store request for React to poll
                    window.widgetPendingRequests.push({
                      id: requestId,
                      method: args.method,
                      params: args.params,
                    });
                    
                    // Set timeout to prevent hanging forever
                    setTimeout(() => {
                      if (pendingPromises.has(requestId)) {
                        console.error('[Widget] Request timeout after 5 minutes:', requestId);
                        reject(new Error('Request timeout - user may have closed the dialog'));
                        pendingPromises.delete(requestId);
                      }
                    }, 5 * 60 * 1000); // 5 minutes timeout
                  });
                }
                
                // Unsupported method
                console.warn('[Widget] Unsupported method:', args.method);
                throw new Error('Unsupported method: ' + args.method);
              },
              
              isConnected: () => true,
            };
            
            window.dispatchEvent(new Event('ethereum#initialized'));
            
            setTimeout(() => {
              if (window.ethereum) {
                // Dispatch connect event
                window.dispatchEvent(new CustomEvent('ethereumConnect', {
                  detail: { chainId: '0x1' }
                }));
              }
            }, 100);
            return 'INJECTION_SUCCESS';
          })();
        `);

        setStatus(`Ready: ${selectedAccount.name}`);
      } catch (error) {
        console.error('[WidgetContainer] Injection failed:', error);
        setStatus(`Failed: ${(error as Error).message}`);
      }
    };

    webview.addEventListener('dom-ready', handleDomReady);

    return () => {
      webview.removeEventListener('dom-ready', handleDomReady);
    };
  }, [selectedAccount, webviewRef]);

  return (
    <Container width="full" height="full">
      <Flex direction="column" height="full" width="full">
        {/* Status Bar */}
        <Container $bgColor="sideBar" px={4} py={2}>
          <Typography $fontSize={12} color="muted">
            {status}
          </Typography>
        </Container>

        {/* Widget Webview */}
        <webview
          ref={webviewRef}
          src={widgetUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
        />
      </Flex>
    </Container>
  );
};

WidgetContainer.defaultProps = {
  widgetUrl: 'https://9716b016517de6f71e42f74b.p2p.org',
};
