(function () {
  console.log('[PRELOAD] Starting widget preload script...');

  window.widgetPendingRequests = [];

  let requestIdCounter = 0;

  const pendingPromises = new Map();

  window.resolveWidgetRequest = function (requestId, result) {
    console.log('[PRELOAD] resolveWidgetRequest called:', requestId);
    const promise = pendingPromises.get(requestId);
    if (promise) {
      promise.resolve(result);
      pendingPromises.delete(requestId);
    } else {
      console.error(
        '[PRELOAD] No pending promise found for request:',
        requestId,
      );
    }
  };

  window.rejectWidgetRequest = function (requestId, errorMessage) {
    console.log('[PRELOAD] rejectWidgetRequest called:', requestId);
    const promise = pendingPromises.get(requestId);
    if (promise) {
      promise.reject(new Error(errorMessage));
      pendingPromises.delete(requestId);
    } else {
      console.error(
        '[PRELOAD] No pending promise found for request:',
        requestId,
      );
    }
  };

  window.ethereum = {
    isMetaMask: false,
    isCypherock: true,
    chainId: '0x1',
    selectedAddress: null,

    request: async function (args) {
      console.log('[PRELOAD] ethereum.request called:', args.method);

      if (
        args.method === 'eth_accounts' ||
        args.method === 'eth_requestAccounts'
      ) {
        const accounts = this.selectedAddress ? [this.selectedAddress] : [];
        console.log('[PRELOAD] Returning accounts:', accounts);
        return accounts;
      }

      if (args.method === 'eth_chainId') {
        console.log('[PRELOAD] Returning chainId: 0x1');
        return '0x1';
      }

      if (args.method === 'wallet_requestPermissions') {
        console.log('[PRELOAD] Granting wallet permissions');
        return [
          {
            parentCapability: 'eth_accounts',
            caveats: [],
          },
        ];
      }

      const handledMethods = [
        'eth_sendTransaction',
        'eth_signTransaction',
        'eth_sign',
        'personal_sign',
        'eth_signTypedData',
        'eth_signTypedData_v4',
      ];

      if (handledMethods.includes(args.method)) {
        return new Promise((resolve, reject) => {
          const requestId =
            'widget-req-' + ++requestIdCounter + '-' + Date.now();
          console.log('[PRELOAD] Creating pending request:', requestId);

          pendingPromises.set(requestId, { resolve, reject });

          window.widgetPendingRequests.push({
            id: requestId,
            method: args.method,
            params: args.params,
          });

          // Set timeout to prevent hanging forever
          setTimeout(() => {
            if (pendingPromises.has(requestId)) {
              console.error(
                '[PRELOAD] Request timeout after 5 minutes:',
                requestId,
              );
              reject(
                new Error('Request timeout - user may have closed the dialog'),
              );
              pendingPromises.delete(requestId);
            }
          }, 5 * 60 * 1000);
        });
      }

      console.warn('[PRELOAD] Unsupported method:', args.method);
      throw new Error('Unsupported method: ' + args.method);
    },

    isConnected: () => true,
  };

  console.log('[PRELOAD] window.ethereum created successfully!');

  window.dispatchEvent(new Event('ethereum#initialized'));
  console.log('[PRELOAD] Dispatched ethereum#initialized event');

  setTimeout(() => {
    if (window.ethereum) {
      window.dispatchEvent(
        new CustomEvent('eip6963:announceProvider', {
          detail: {
            info: {
              name: 'Cypherock',
              icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>',
              rdns: 'com.cypherock.cysync',
            },
            provider: window.ethereum,
          },
        }),
      );

      // Legacy connect event
      window.dispatchEvent(
        new CustomEvent('ethereumConnect', {
          detail: { chainId: '0x1' },
        }),
      );

      console.log('[PRELOAD] Dispatched all provider announcement events');
    }
  }, 100);

  window.addEventListener('eip6963:requestProvider', () => {
    console.log('[PRELOAD] Widget requested providers, announcing...');
    if (window.ethereum) {
      window.dispatchEvent(
        new CustomEvent('eip6963:announceProvider', {
          detail: {
            info: {
              name: 'Cypherock',
              icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>',
              rdns: 'com.cypherock.cysync',
            },
            provider: window.ethereum,
          },
        }),
      );
    }
  });

  console.log('[PRELOAD] Preload script complete');
})();
