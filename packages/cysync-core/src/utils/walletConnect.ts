import {
  AddExternalLinkListener,
  RemoveExternalLinkListener,
  InitWCUri,
} from '@cypherock/cysync-interfaces';
import type walletConnectCoreType from '@walletconnect/core';
import type web3WalletType from '@walletconnect/web3wallet';

export interface WalletConnectLibType {
  Web3Wallet: typeof web3WalletType;
}
export interface WalletConnectCoreLibType {
  Core: typeof walletConnectCoreType;
}

let walletConnect: WalletConnectLibType | undefined;
let walletConnectCore: WalletConnectCoreLibType | undefined;
let initWCUriMethod: InitWCUri | undefined;
let addExternalLinkListenerMethod: AddExternalLinkListener | undefined;
let removeExternalLinkListenerMethod: RemoveExternalLinkListener | undefined;

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

export const getInitWCUriMethod = () => {
  if (!initWCUriMethod)
    throw new Error('Init WC Uri method has not been defined');

  return initWCUriMethod;
};

export const setInitWCUriMethod = (method: InitWCUri) => {
  initWCUriMethod = method;
};
export const getAddExternalLinkListenerMethod = () => {
  if (!addExternalLinkListenerMethod)
    throw new Error('Add External Link Listener method has not been defined');

  return addExternalLinkListenerMethod;
};

export const setAddExternalLinkListenerMethod = (
  method: AddExternalLinkListener,
) => {
  addExternalLinkListenerMethod = method;
};

export const getRemoveExternalLinkListenerMethod = () => {
  if (!removeExternalLinkListenerMethod)
    throw new Error('Add External Link Listener method has not been defined');

  return removeExternalLinkListenerMethod;
};

export const setRemoveExternalLinkListenerMethod = (
  method: RemoveExternalLinkListener,
) => {
  removeExternalLinkListenerMethod = method;
};
