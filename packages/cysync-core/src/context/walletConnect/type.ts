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
}

export enum WalletConnectConnectionState {
  NOT_CONNECTED,
  CONNECTING,
  SELECT_ACCOUNT,
  CONNECTED,
}

const protobufEnumMapper = [
  WalletConnectCallRequestMethodMap.ETH_SIGN,
  WalletConnectCallRequestMethodMap.SIGN_PERSONAL,
  WalletConnectCallRequestMethodMap.SIGN_TYPED,
  WalletConnectCallRequestMethodMap.SIGN_TYPED_V4,
];

export const getProtoBufferEnum = (type: WalletConnectCallRequestMethod) => {
  if (type === WalletConnectCallRequestMethodMap.SIGN_TYPED_V4) return 3;
  return protobufEnumMapper.findIndex(el => el === type) + 1;
};

export interface WalletConnectDapp {
  logo: string;
  url: string;
  name: string;
}
