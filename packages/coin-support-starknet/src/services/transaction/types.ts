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

export interface StarknetPrepareInvokeTransactionParams {
  address: string;
  contractAddress: string;
  recipientAddress: string;
  amount: string;
  nonce: string;
  resourceBounds: StarknetResourceBounds;
  signature?: string;
}

export interface StarknetPrepareDeployTransactionParams {
  assetId: string;
  nonce: string;
  resourceBounds: StarknetResourceBounds;
  salt?: string;
  signature?: string;
}

export enum StarknetTransactionTypes {
  INVOKE = 'INVOKE',
  DEPLOY_ACCOUNT = 'DEPLOY_ACCOUNT',
}

export interface StarknetInvokeTransaction {
  type: StarknetTransactionTypes.INVOKE;
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

export interface StarknetDeployAccountTransaction {
  type: StarknetTransactionTypes.DEPLOY_ACCOUNT;
  constructor_calldata: string[];
  class_hash: string;
  contract_address_salt: string;
  version: string;
  nonce: string;
  tip: string;
  paymaster_data: any[];
  nonce_data_availability_mode: string;
  fee_data_availability_mode: string;
  resource_bounds: StarknetResourceBounds;
  signature: string[];
}

export type StarknetTransaction =
  | StarknetInvokeTransaction
  | StarknetDeployAccountTransaction;
