import '@/polyfills';
import logger, { createServiceLogger, updateLogger } from './logger';

const { BtcSupport } = require('@cypherock/coin-support-btc');
const { EvmSupport } = require('@cypherock/coin-support-evm');
const { NearSupport } = require('@cypherock/coin-support-near');
const { SolanaSupport } = require('@cypherock/coin-support-solana');
const { StarknetSupport } = require('@cypherock/coin-support-starknet');
import { StellarSupport } from '@cypherock/coin-support-stellar';
const { TronSupport } = require('@cypherock/coin-support-tron');
const { XrpSupport } = require('@cypherock/coin-support-xrp');
const { IcpSupport } = require('@cypherock/coin-support-icp');
const { configurePlatform } = require('@cypherock/cysync-core-services');

export const setGlobalDependencies = () => {
  try {
    const bitcoinJsLib = require('bitcoinjs-lib');
    const nearApiJs = require('near-api-js');
    const ethers = require('ethers');
    const eip712 = require('eip-712');
    const web3 = require('web3');
    const solanaWeb3 = require('@solana/web3.js');
    const solanaSplToken = require('@solana/spl-token');
    const TronWeb = require('tronweb');
    const stellarSdk = require('stellar-sdk');
    const xrpl = require('xrpl');
    const starknet = require('starknet');
    const dfinity = {
      agent: require('@dfinity/agent'),
      icp: require('@dfinity/ledger-icp'),
      candid: require('@dfinity/candid'),
      principal: require('@dfinity/principal'),
    };

    BtcSupport.setBitcoinLibrary(bitcoinJsLib);
    NearSupport.setNearApiJs(nearApiJs);
    EvmSupport.setEthersLibrary(ethers);
    EvmSupport.setEip712Library(eip712);
    EvmSupport.setWeb3Library(web3);
    SolanaSupport.setWeb3Library(solanaWeb3);
    SolanaSupport.setSplTokenLibrary(solanaSplToken);
    TronSupport.setTronWeb(
      new TronWeb({ fullHost: 'https://api.trongrid.io' }),
    );
    XrpSupport.setXrpLib(xrpl);
    StellarSupport.setStellarLib(stellarSdk);
    StarknetSupport.setStarknetLib(starknet);
    IcpSupport.setDfinityLib(dfinity);

    logger.info('All dependencies injected successfully');
  } catch (error) {
    logger.error('Failed to inject dependencies', { error });
  }
};

export const setCoreDependencies = () => {
  configurePlatform('react-native');
  updateLogger(createServiceLogger);
};
