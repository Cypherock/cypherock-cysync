import { createServiceLogger, updateLogger } from './logger';

const { BtcSupport } = require('@cypherock/coin-support-btc');
const { EvmSupport } = require('@cypherock/coin-support-evm');
const { NearSupport } = require('@cypherock/coin-support-near');
const { SolanaSupport } = require('@cypherock/coin-support-solana');
const { StarknetSupport } = require('@cypherock/coin-support-starknet');
const { TronSupport } = require('@cypherock/coin-support-tron');
const { XrpSupport } = require('@cypherock/coin-support-xrp');
const { IcpSupport } = require('@cypherock/coin-support-icp');

export const setGlobalDependencies = async () => {
  BtcSupport.setBitcoinLibrary((globalThis as any).BitcoinJsLib);
  NearSupport.setNearApiJs((globalThis as any).NearApiJs);
  EvmSupport.setEthersLibrary((globalThis as any).ethers);
  EvmSupport.setEip712Library((globalThis as any).eip712);
  EvmSupport.setWeb3Library((globalThis as any).web3);
  SolanaSupport.setWeb3Library((globalThis as any).solanaWeb3);
  SolanaSupport.setSplTokenLibrary((globalThis as any).solanaSplToken);
  TronSupport.setTronWeb(
    new (globalThis as any).TronWeb({ fullHost: 'https://api.trongrid.io' }),
  );
  XrpSupport.setXrpLib((globalThis as any).xrpl);
  StarknetSupport.setStarknetLib((globalThis as any).starknet);
  IcpSupport.setDfinityLib((globalThis as any).dfinity);
};

export const setCoreDependencies = async () => {
  updateLogger(createServiceLogger);
};
