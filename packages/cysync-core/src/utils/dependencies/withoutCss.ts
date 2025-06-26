import '../../generated';
import { BtcSupport } from '@cypherock/coin-support-btc';
import { EvmSupport } from '@cypherock/coin-support-evm';
import { IcpSupport } from '@cypherock/coin-support-icp';
import { NearSupport } from '@cypherock/coin-support-near';
import { SolanaSupport } from '@cypherock/coin-support-solana';
import { StarknetSupport } from '@cypherock/coin-support-starknet';
import { TronSupport } from '@cypherock/coin-support-tron';
import { XrpSupport } from '@cypherock/coin-support-xrp';

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
  SolanaSupport.setSplTokenLibrary((globalThis as any).solanaSplToken);
  TronSupport.setTronWeb(
    new (globalThis as any).TronWeb({ fullHost: 'https://api.trongrid.io' }),
  );
  XrpSupport.setXrpLib((globalThis as any).xrpl);
  StarknetSupport.setStarknetLib((globalThis as any).starknet);
  IcpSupport.setDfinityLib((globalThis as any).dfinity);
};
