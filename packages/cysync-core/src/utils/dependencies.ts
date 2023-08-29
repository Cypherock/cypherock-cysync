import '../generated/bitcoinjs-lib';
import '../generated/near-api-js';
import { BtcSupport } from '@cypherock/coin-support-btc';
import { EvmSupport } from '@cypherock/coin-support-evm';
import { NearSupport } from '@cypherock/coin-support-near';

export const setDependencies = () => {
  BtcSupport.setBitcoinLibrary((window as any).BitcoinJsLib);
  NearSupport.setNearApiJs((window as any).NearApiJs);
  EvmSupport.setEthersLibrary((window as any).ethers);
};
