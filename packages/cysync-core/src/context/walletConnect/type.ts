import { SignMessageType } from '@cypherock/coin-support-interfaces';
import { coinFamiliesMap } from '@cypherock/coins';
import { IAccount } from '@cypherock/db-interfaces';

export const WalletConnectCallRequestMethodMap = {
  ETH_SEND_TXN: 'eth_sendTransaction',
  ETH_SIGN_TXN: 'eth_signTransaction',
  ETH_SIGN: 'eth_sign',
  SIGN_PERSONAL: 'personal_sign',
  SIGN_TYPED: 'eth_signTypedData',
  SIGN_TYPED_V4: 'eth_signTypedData_v4',
} as const;

export type WalletConnectCallRequestMethod =
  (typeof WalletConnectCallRequestMethodMap)[keyof typeof WalletConnectCallRequestMethodMap];

export interface WalletConnectCallRequestData {
  method: WalletConnectCallRequestMethod;
  params: any;
  id: number;
  topic?: string;
}

export enum WalletConnectConnectionState {
  NOT_CONNECTED,
  CONNECTING,
  SELECT_ACCOUNT,
  CONNECTED,
  CONNECTION_ERROR,
}

export interface WalletConnectionConnectionClientMeta {
  description?: string;
  url?: string;
  icons?: string[];
  name?: string;
}
export const ACCEPTED_SEND_METHODS: WalletConnectCallRequestMethod[] = [
  WalletConnectCallRequestMethodMap.ETH_SIGN_TXN,
  WalletConnectCallRequestMethodMap.ETH_SEND_TXN,
];
export const ACCEPTED_SIGN_METHODS: WalletConnectCallRequestMethod[] = [
  WalletConnectCallRequestMethodMap.ETH_SIGN,
  WalletConnectCallRequestMethodMap.SIGN_PERSONAL,
  WalletConnectCallRequestMethodMap.SIGN_TYPED,
  WalletConnectCallRequestMethodMap.SIGN_TYPED_V4,
];

export const WalletConnectSignMessageMap: Partial<
  Record<WalletConnectCallRequestMethod, SignMessageType>
> = {
  [WalletConnectCallRequestMethodMap.ETH_SIGN]: SignMessageType.ETH_MESSAGE,
  [WalletConnectCallRequestMethodMap.SIGN_PERSONAL]:
    SignMessageType.PRIVATE_MESSAGE,
  [WalletConnectCallRequestMethodMap.SIGN_TYPED]: SignMessageType.TYPED_MESSAGE,
  [WalletConnectCallRequestMethodMap.SIGN_TYPED_V4]:
    SignMessageType.TYPED_MESSAGE,
};

export const ACCEPTED_CALL_METHODS = [
  ...ACCEPTED_SEND_METHODS,
  ...ACCEPTED_SIGN_METHODS,
];

export interface useWalletConnectVersionProps {
  setConnectionClientMeta: React.Dispatch<
    React.SetStateAction<WalletConnectionConnectionClientMeta | undefined>
  >;

  connectionState: WalletConnectConnectionState;
  setConnectionState: React.Dispatch<
    React.SetStateAction<WalletConnectConnectionState>
  >;
  callRequestData: WalletConnectCallRequestData | undefined;
  setCallRequestData: React.Dispatch<
    React.SetStateAction<WalletConnectCallRequestData | undefined>
  >;
  setConnectionError: React.Dispatch<React.SetStateAction<string>>;
  setErrorTitle: React.Dispatch<React.SetStateAction<string>>;
  setErrorSubtitle: React.Dispatch<React.SetStateAction<string>>;
  connectionTimeoutRef: React.MutableRefObject<NodeJS.Timeout | undefined>;
  openDialog: () => void;
  closeDialog: () => void;
  updateActiveAccount: (account?: IAccount) => void;
}

export interface IClientMeta {
  description: string;
  url: string;
  icons: string[];
  name: string;
}

export interface IWalletConnectMethods {
  init: (uri: string, metadata: IClientMeta) => Promise<void>;
  disconnect: () => Promise<void>;
  approveSession: (accounts: IAccount[]) => Promise<void>;
  approveCall: (result: string) => Promise<void>;
  rejectCall: (message?: string) => Promise<void>;
  resetStates: () => void;
}

export const supportedWalletConnectFamilies: string[] = [coinFamiliesMap.evm];
