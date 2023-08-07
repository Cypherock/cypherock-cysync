import '../generated/buffer';
import '../generated/bitcoinjs-lib';
import { BtcSupport } from '@cypherock/coin-support-btc';
import { EvmSupport } from '@cypherock/coin-support-evm';

export const setDependencies = () => {
  (window as any).Buffer = (window as any).BufferLib.Buffer;
  BtcSupport.setBitcoinLibrary((window as any).BitcoinJsLib);
  EvmSupport.setEthersLibrary((window as any).ethers);
};
