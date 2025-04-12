globalThis.Buffer = require('safe-buffer').Buffer;
globalThis.BitcoinJsLib = require('bitcoinjs-lib');
globalThis.NearApiJs = require('near-api-js');
globalThis.WalletConnect = require('@walletconnect/web3wallet');
globalThis.WalletConnectCore = require('@walletconnect/core');
globalThis.eip712 = require('eip-712');
globalThis.ethers = require('ethers');
globalThis.TronWeb = require('tronweb');
globalThis.web3 = require('web3');
globalThis.solanaWeb3 = require('@solana/web3.js');
globalThis.solanaSplToken = require('@solana/spl-token');
globalThis.xrpl = require('xrpl');
globalThis.starknet = require('starknet');
globalThis.dfinity = {
  agent: require('@dfinity/agent'),
  icp: require('@dfinity/ledger-icp'),
  candid: require('@dfinity/candid'),
  principal: require('@dfinity/principal'),
};
