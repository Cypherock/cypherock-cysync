import type walletConnectLib from '@walletconnect/web3wallet';
import type walletConnectCoreLib from '@walletconnect/core';

export type WalletConnectLibType = typeof walletConnectLib;
export type WalletConnectCoreLibType = typeof walletConnectCoreLib;

let walletConnect: WalletConnectLibType | undefined;
let walletConnectCore: WalletConnectCoreLibType | undefined;

export const getWalletConnect = () => {
  if (!walletConnect) {
    throw new Error('Wallet connect is not defined');
  }

  return walletConnect;
};

export const setWalletConnect = (method: WalletConnectLibType) => {
  walletConnect = method;
};

export const getWalletConnectCore = () => {
  if (!walletConnectCore) {
    throw new Error('Wallet connect core is not defined');
  }

  return walletConnectCore;
};

export const setWalletConnectCore = (method: WalletConnectCoreLibType) => {
  walletConnectCore = method;
};
