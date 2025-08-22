import 'react-native-get-random-values';
import 'react-native-gesture-handler';
import structuredClone from '@ungap/structured-clone';
import { Buffer } from 'buffer';
import 'expo-router/entry';

if (__DEV__) {
  process.env = { ...process.env, NODE_ENV: 'development' };
} else {
  process.env = { ...process.env, NODE_ENV: 'production' };
}

// plyfill for structuredClone (required in core services)
if (!('structuredClone' in globalThis)) {
  globalThis.structuredClone = structuredClone;
}

if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}

// polyfills for coin support
globalThis.BitcoinJsLib = require('bitcoinjs-lib');
globalThis.NearApiJs = require('near-api-js');
globalThis.eip712 = require('eip-712');
globalThis.ethers = require('ethers');
globalThis.TronWeb = require('tronweb');
globalThis.web3 = require('web3');
globalThis.solanaWeb3 = require('@solana/web3.js');
globalThis.solanaSplToken = require('@solana/spl-token');
globalThis.StellarSdk = require('stellar-sdk');
globalThis.xrpl = require('xrpl');
globalThis.starknet = require('starknet');
globalThis.dfinity = {
  agent: require('@dfinity/agent'),
  icp: require('@dfinity/ledger-icp'),
  candid: require('@dfinity/candid'),
  principal: require('@dfinity/principal'),
};
