import '../generated/bitcoinjs-lib';
import { BtcSupport } from '@cypherock/coin-support-btc';

export const setDependencies = () => {
  BtcSupport.setBitcoinLibrary((window as any).BitcoinJsLib);
};
