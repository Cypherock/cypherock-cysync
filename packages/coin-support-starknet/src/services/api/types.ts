export interface IStarknetTransactionItem {
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

export interface IStarknetTransactionResult {
  result: IStarknetTransactionItem[];
  more: boolean;
}

export interface IStarknetContractTransactionItem {
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

export interface IStarknetContractTransactionResult {
  result: IStarknetContractTransactionItem[];
  more: boolean;
}
