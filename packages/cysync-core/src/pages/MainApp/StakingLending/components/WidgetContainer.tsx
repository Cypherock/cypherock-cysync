/* eslint-disable */
import { Container, Flex, Typography } from '@cypherock/cysync-ui';
import { IAccount } from '@cypherock/db-interfaces';
import React, { useEffect, useRef, useState } from 'react';

export interface WidgetContainerProps {
  selectedAccount: IAccount;
  onError?: (error: string) => void;
  onDisconnect?: () => void;
  widgetUrl?: string;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  selectedAccount,
  onError: _onError,
  onDisconnect: _onDisconnect,
  widgetUrl = 'https://9716b016517de6f71e42f74b.p2p.org',
}) => {
  const webviewRef = useRef<any>(null);
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview) return () => undefined;

    const handleDomReady = async () => {
      console.log('DEBUG: DOM ready, injecting wallet...');
      setStatus('Injecting wallet...');

      try {
        webview.openDevTools();
        console.log('DEBUG: Devtools should be opening now');

        const result = await webview.executeJavaScript(`
          console.log('=== WALLET INJECTION STARTING ===');

          const eventEmitter = {
            events: {},
            on: function(event, callback) {
              if (!this.events[event]) this.events[event] = [];
              this.events[event].push(callback);
            },
            removeListener: function(event, callback) {
              if (this.events[event]) {
                this.events[event] = this.events[event].filter(cb => cb !== callback);
              }
            },
            emit: function(event, data) {
              if (this.events[event]) {
                this.events[event].forEach(callback => callback(data));
              }
            }
          };

          window.ethereum = {
            isMetaMask: false,
            isCypherock: true,
            chainId: '0x1',
            selectedAddress: '${selectedAccount.xpubOrAddress}',
            
            request: async function(args) {
              console.log('WALLET REQUEST:', args.method, args.params);
              
              if (args.method === 'eth_accounts' || args.method === 'eth_requestAccounts') {
                console.log('RETURNING ACCOUNTS:', ['${selectedAccount.xpubOrAddress}']);
                return ['${selectedAccount.xpubOrAddress}'];
              }
              
              if (args.method === 'eth_chainId') {
                console.log('RETURNING CHAIN ID: 0x1');
                return '0x1';
              }
              
              console.log('UNSUPPORTED METHOD:', args.method);
              throw new Error('Unsupported method');
            },
            
            on: eventEmitter.on.bind(eventEmitter),
            removeListener: eventEmitter.removeListener.bind(eventEmitter),
            emit: eventEmitter.emit.bind(eventEmitter),
            isConnected: () => true
          };
          
          console.log('FIRING WALLET EVENTS...');
          window.dispatchEvent(new Event('ethereum#initialized'));

          setTimeout(() => {
            if (window.ethereum && window.ethereum.emit) {
              window.ethereum.emit('connect', { chainId: '0x1' });
              window.ethereum.emit('accountsChanged', ['${selectedAccount.xpubOrAddress}']);
              window.ethereum.emit('chainChanged', '0x1');
              console.log('EIP-1193 EVENTS FIRED: connect, accountsChanged, chainChanged');
            }
          }, 100);
          
          console.log('=== WALLET INJECTION COMPLETE ===');
          console.log('window.ethereum exists:', !!window.ethereum);
          console.log('window.ethereum.isMetaMask:', window.ethereum.isMetaMask);
          console.log('window.ethereum.isCypherock:', window.ethereum.isCypherock);
          
          setTimeout(() => {
            console.log('=== TESTING WALLET ===');
            if (window.ethereum) {
              window.ethereum.request({ method: 'eth_accounts' })
                .then(accounts => console.log('TEST RESULT - accounts:', accounts))
                .catch(err => console.log('TEST ERROR:', err));
            }
          }, 1000);
          
          'INJECTION_COMPLETE';
        `);

        console.log('DEBUG: Injection result:', result);
        setStatus(`Injected: ${result}`);
      } catch (error) {
        console.error('DEBUG: Injection failed:', error);
        setStatus(`Failed: ${(error as Error).message}`);
      }
    };

    webview.addEventListener('dom-ready', handleDomReady);

    return () => {
      webview.removeEventListener('dom-ready', handleDomReady);
    };
  }, [selectedAccount]);

  return (
    <Container width="full" height="full">
      <Flex direction="column" height="full" width="full">
        <Container $bgColor="sideBar" px={4} py={2}>
          <Typography $fontSize={12}>
            {selectedAccount.name} | {status}
          </Typography>
        </Container>

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
