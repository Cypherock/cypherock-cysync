export interface IStarknetTransactionParams {
  address: string;
  assetId: string;
  contractAddress?: string;
  fromBlock?: number;
  toBlock?: number;
  pageSize?: number;
  pageKey?: string;
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
}

export interface IStarknetTransactionResult {
  walletAddress: string;
  count: number;
  tokenTransfers: IStarknetResponseTransaction[];
  nextPageKey?: string;
}
