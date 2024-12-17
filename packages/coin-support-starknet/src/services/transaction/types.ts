interface StarknetGasBounds {
  max_amount: string;
  max_price_per_unit: string;
}

interface StarknetResourceBounds {
  l1_gas: StarknetGasBounds;
  l2_gas: StarknetGasBounds;
}

export interface FeeData {
  suggestedMaxFee: string;
  resourceBounds: StarknetResourceBounds;
  unit: string;
}

export interface StarknetInvokeTransaction {
  type: 'INVOKE';
  sender_address: string;
  calldata: string[];
  version: string;
  nonce: string;
  tip: string;
  paymaster_data: any[];
  account_deployment_data: any[];
  nonce_data_availability_mode: string;
  fee_data_availability_mode: string;
  resource_bounds: StarknetResourceBounds;
  signature: string[];
}

export type StarknetTransaction = StarknetInvokeTransaction;

export interface StarknetPrepareInvokeTransactionParams {
  address: string;
  contractAddress: string;
  recipientAddress: string;
  amount: string;
  nonce: string;
  resourceBounds: StarknetResourceBounds;
  signature?: string;
}
