import 'react-native-get-random-values';
import { Buffer } from 'buffer';
import * as crypto from 'react-native-quick-crypto';

if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}
if (typeof global.crypto === 'undefined') {
  global.crypto = crypto;
}

import 'text-encoding-polyfill';
import 'react-native-url-polyfill/auto';
import 'react-native-gesture-handler';

if (__DEV__) {
  process.env = { ...process.env, NODE_ENV: 'development' };
} else {
  process.env = { ...process.env, NODE_ENV: 'production' };
}

const lazyRequire = getter => {
  let cached;
  return () => {
    if (!cached) cached = getter();
    return cached;
  };
};

const cryptoLibs = {
  BitcoinJsLib: lazyRequire(() => require('bitcoinjs-lib')),
  NearApiJs: lazyRequire(() => require('near-api-js')),
  eip712: lazyRequire(() => require('eip-712')),
  ethers: lazyRequire(() => require('ethers')),
  TronWeb: lazyRequire(() => require('tronweb')),
  web3: lazyRequire(() => require('web3')),
  solanaWeb3: lazyRequire(() => require('@solana/web3.js')),
  solanaSplToken: lazyRequire(() => require('@solana/spl-token')),
  StellarSdk: lazyRequire(() => require('stellar-sdk')),
  xrpl: lazyRequire(() => require('xrpl')),
  starknet: lazyRequire(() => require('starknet')),
  dfinity: lazyRequire(() => ({
    agent: require('@dfinity/agent'),
    icp: require('@dfinity/ledger-icp'),
    candid: require('@dfinity/candid'),
    principal: require('@dfinity/principal'),
  })),
};

Object.keys(cryptoLibs).forEach(key => {
  Object.defineProperty(globalThis, key, {
    get: cryptoLibs[key],
    configurable: true,
  });
});
