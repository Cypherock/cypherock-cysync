import { Container, Flex, Typography } from '@cypherock/cysync-ui';
import { IAccount } from '@cypherock/db-interfaces';
import React, { useEffect, useState } from 'react';

export interface WidgetContainerProps {
  selectedAccount: IAccount;
  webviewRef: React.RefObject<any>;
  onError?: (error: string) => void;
  onDisconnect?: () => void;
  widgetUrl?: string;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  selectedAccount,
  webviewRef,
  onError: _onError,
  onDisconnect: _onDisconnect,
  widgetUrl = 'https://9716b016517de6f71e42f74b.p2p.org',
}) => {
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview) return () => undefined;

    const handleDomReady = async () => {
      console.log('[WidgetContainer] DOM ready, injecting wallet provider...');
      setStatus('Injecting wallet...');

      try {
        // Open DevTools for debugging (optional - remove in production)
        webview.openDevTools();

        const injectionResult = await webview.executeJavaScript(`
          (function() {
            console.log('=== CYPHEROCK WALLET INJECTION STARTING ===');

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
              console.log('[Widget] Resolving request:', requestId, 'with result:', result.substring(0, 20) + '...');
              
              const promise = pendingPromises.get(requestId);
              if (promise) {
                promise.resolve(result);
                pendingPromises.delete(requestId);
                console.log('[Widget] Request resolved successfully');
              } else {
                console.error('[Widget] No pending promise found for request:', requestId);
              }
            };

            /**
             * Reject a request (called by React when user cancels)
             */
            window.rejectWidgetRequest = function(requestId, errorMessage) {
              console.log('[Widget] Rejecting request:', requestId, 'reason:', errorMessage);
              
              const promise = pendingPromises.get(requestId);
              if (promise) {
                promise.reject(new Error(errorMessage));
                pendingPromises.delete(requestId);
                console.log('[Widget] Request rejected');
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
                console.log('[Widget] Request:', args.method, args.params);
                
                // Handle account queries
                if (args.method === 'eth_accounts' || args.method === 'eth_requestAccounts') {
                  const accounts = ['${selectedAccount.xpubOrAddress}'];
                  console.log('[Widget] Returning accounts:', accounts);
                  return accounts;
                }
                
                // Handle chain ID query
                if (args.method === 'eth_chainId') {
                  console.log('[Widget] Returning chainId: 0x1');
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
                    
                    console.log('[Widget] Creating pending request:', requestId);
                    
                    // Store the promise resolvers
                    pendingPromises.set(requestId, { resolve, reject });
                    
                    // Store request for React to poll
                    window.widgetPendingRequests.push({
                      id: requestId,
                      method: args.method,
                      params: args.params,
                    });
                    
                    console.log('[Widget] Request stored, waiting for React to handle...');
                    
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
              
              /**
               * Event emitter interface (required by some dApps)
               */
              on: function(event, callback) {
                console.log('[Widget] Event listener registered:', event);
                // Simplified event emitter - can be enhanced if needed
              },
              
              removeListener: function(event, callback) {
                console.log('[Widget] Event listener removed:', event);
              },
              
              isConnected: () => true,
            };
            
            // Fire EIP-1193 initialization events
            console.log('[Widget] Firing initialization events...');
            
            window.dispatchEvent(new Event('ethereum#initialized'));
            
            // Fire connect events after a short delay
            setTimeout(() => {
              if (window.ethereum) {
                // Dispatch connect event
                window.dispatchEvent(new CustomEvent('ethereumConnect', {
                  detail: { chainId: '0x1' }
                }));
                
                console.log('[Widget] EIP-1193 events fired successfully');
              }
            }, 100);
            
            console.log('=== CYPHEROCK WALLET INJECTION COMPLETE ===');
            console.log('[Widget] window.ethereum:', !!window.ethereum);
            console.log('[Widget] Account:', '${selectedAccount.xpubOrAddress}');
            
            return 'INJECTION_SUCCESS';
          })();
        `);

        console.log('[WidgetContainer] Injection result:', injectionResult);
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
  onError: undefined,
  onDisconnect: undefined,
  widgetUrl: 'https://9716b016517de6f71e42f74b.p2p.org',
};