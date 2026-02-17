import { ipcConfig } from './helpers/config';

let currentWidgetAddress: string | null = null;

const setWidgetAddress = async (address: string) => {
  currentWidgetAddress = address;
  return true;
};

export const getCurrentWidgetAddress = () => currentWidgetAddress;

export const getWidgetIPCHandlers = () => [
  {
    name: ipcConfig.methods.setWidgetAddress,
    func: setWidgetAddress,
  },
];

export const getWidgetInjectionScript = (address: string) => `
  (function() {
    window.widgetPendingRequests = [];
    let requestIdCounter = 0;
    const pendingPromises = new Map();

    window.resolveWidgetRequest = function(requestId, result) {
      const promise = pendingPromises.get(requestId);
      if (promise) {
        promise.resolve(result);
        pendingPromises.delete(requestId);
      }
    };

    window.rejectWidgetRequest = function(requestId, errorMessage) {
      const promise = pendingPromises.get(requestId);
      if (promise) {
        promise.reject(new Error(errorMessage));
        pendingPromises.delete(requestId);
      }
    };

    window.ethereum = {
      isMetaMask: false,
      isCypherock: true,
      chainId: '0x1',
      selectedAddress: '${address}',
      
      request: async function(args) {
        if (args.method === 'eth_accounts' || args.method === 'eth_requestAccounts') {
          const accounts = ['${address}'];
          return accounts;
        }
        
        if (args.method === 'eth_chainId') {
          return '0x1';
        }
        
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
            const requestId = 'widget-req-' + (++requestIdCounter) + '-' + Date.now();
            pendingPromises.set(requestId, { resolve, reject });
            
            window.widgetPendingRequests.push({
              id: requestId,
              method: args.method,
              params: args.params,
            });
            
            setTimeout(() => {
              if (pendingPromises.has(requestId)) {
                reject(new Error('Request timeout'));
                pendingPromises.delete(requestId);
              }
            }, 5 * 60 * 1000);
          });
        }
        
        throw new Error('Unsupported method: ' + args.method);
      },
      
      on: function(event, callback) {
        
      },
      
      removeListener: function(event, callback) {
        
      },
      
      isConnected: () => true,
    };
    
    window.dispatchEvent(new Event('ethereum#initialized'));
    
    setTimeout(() => {
      if (window.ethereum) {
        window.dispatchEvent(new CustomEvent('ethereumConnect', {
          detail: { chainId: '0x1' }
        }));
      }
    }, 100);
    
    return 'INJECTION_SUCCESS';
  })();
`;
