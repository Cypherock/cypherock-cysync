export interface IEvmTransactionItem {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  methodId: string;
  functionName?: string;
  traceId?: string;
  type?: string;
}

export interface IEvmTransactionResult {
  result: IEvmTransactionItem[];
  more: boolean;
}

export interface IEvmContractTransactionItem {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
}

export interface IEvmContractTransactionResult {
  result: IEvmContractTransactionItem[];
  more: boolean;
}
