/**
 * Widget Provider Types
 *
 * These types define the widget's internal state.
 * The WidgetWalletConnectBridge maps these to WalletConnect's interface.
 */

export interface WidgetCallRequestData {
  method: string;
  params: any[];
  id: string;
}

export interface WidgetContextInterface {
  // Request state
  callRequestData: WidgetCallRequestData | null;

  // Methods that dialogs will call (via bridge)
  approveCallRequest: (result: string) => void;
  rejectCallRequest: (reason?: string) => void;

  // Internal state
  isActive: boolean; // True when widget has pending requests
}

export const WIDGET_SUPPORTED_METHODS = {
  ETH_SEND_TRANSACTION: 'eth_sendTransaction',
  ETH_SIGN_TRANSACTION: 'eth_signTransaction',
  ETH_SIGN: 'eth_sign',
  PERSONAL_SIGN: 'personal_sign',
  ETH_SIGN_TYPED_DATA: 'eth_signTypedData',
  ETH_SIGN_TYPED_DATA_V4: 'eth_signTypedData_v4',
} as const;

export type WidgetSupportedMethod =
  (typeof WIDGET_SUPPORTED_METHODS)[keyof typeof WIDGET_SUPPORTED_METHODS];

/**
 * Request stored in webview with promise resolvers
 */
export interface WebviewPendingRequest {
  id: string;
  method: string;
  params: any[];
  resolve: (value: string) => void;
  reject: (reason?: any) => void;
  timestamp: number;
}
