export interface IStarknetTransactionParams {
  address: string;
  assetId: string;
  contractAddress?: string;
  fromBlock?: number;
  pageSize?: number;
}

export interface IStarknetResponseTransaction {
  contractAddress: string;
  contractDecimals: string;
  contractName: string;
  contractSymbols: string;
  fromAddress: string;
  toAddress: string;
  value: string;
  blockHash: string;
  blockNumber: number;
  blockTimestamp: string;
  transactionHash: string;
  transactionIndex: number;
  transactionFee: string;
  status: string;
}

export interface IStarknetTransactionHistoryResult {
  count: number;
  transactions: IStarknetResponseTransaction[];
  hasMore: boolean;
}
