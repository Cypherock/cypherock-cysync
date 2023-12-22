import '../../generated';
import { BtcSupport } from '@cypherock/coin-support-btc';
import { EvmSupport } from '@cypherock/coin-support-evm';
import { NearSupport } from '@cypherock/coin-support-near';
import { SolanaSupport } from '@cypherock/coin-support-solana';

import { setWalletConnect, setWalletConnectCore } from '../walletConnect';

export const setGlobalDependencies = () => {
  setWalletConnect((globalThis as any).WalletConnect);
  setWalletConnectCore((globalThis as any).WalletConnectCore);
  BtcSupport.setBitcoinLibrary((globalThis as any).BitcoinJsLib);
  NearSupport.setNearApiJs((globalThis as any).NearApiJs);
  EvmSupport.setEthersLibrary((globalThis as any).ethers);
  EvmSupport.setEip712Library((globalThis as any).eip712);
  EvmSupport.setWeb3Library((globalThis as any).web3);
  SolanaSupport.setWeb3Library((globalThis as any).solanaWeb3);
};
