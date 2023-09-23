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
