import '../generated';
import 'react-virtualized/styles.css';
import { BtcSupport } from '@cypherock/coin-support-btc';
import { EvmSupport } from '@cypherock/coin-support-evm';
import { NearSupport } from '@cypherock/coin-support-near';

import { setWalletConnect, setWalletConnectCore } from './walletConnect';

export const setDependencies = () => {
  setWalletConnect((window as any).WalletConnect);
  setWalletConnectCore((window as any).WalletConnectCore);
  BtcSupport.setBitcoinLibrary((window as any).BitcoinJsLib);
  NearSupport.setNearApiJs((window as any).NearApiJs);
  EvmSupport.setEthersLibrary((window as any).ethers);
  EvmSupport.setEip712Library((window as any).eip712);
  EvmSupport.setWeb3Library((window as any).web3);
};
