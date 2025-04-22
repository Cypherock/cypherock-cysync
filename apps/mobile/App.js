import 'react-native-get-random-values';
import 'node-libs-react-native/globals';
import { randomBytes } from 'react-native-randombytes';
import structuredClone from '@ungap/structured-clone';
import { setGlobalDependencies } from './utils';

if (__DEV__) {
  process.env = { ...process.env, NODE_ENV: 'development' };
} else {
  process.env = { ...process.env, NODE_ENV: 'production' };
}

// polyfill for random bytes
if (!global.crypto) {
  global.crypto = {
    getRandomValues: buffer => randomBytes(buffer.length).copy(buffer),
  };
}

// plyfill for structuredClone (required in core services)
if (!('structuredClone' in globalThis)) {
  globalThis.structuredClone = structuredClone;
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
globalThis.xrpl = require('xrpl');
globalThis.starknet = require('starknet');

import 'expo-router/entry';
