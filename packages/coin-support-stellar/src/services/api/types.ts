export interface IStellarTransactionParams {
  address: string;
  assetId: string;
  limit?: number;
  cursor?: string;
}

export interface IStellarOperationResponse {
  type: string;
  sourceAccount?: string;
  destination: string;
  amount: string;
}

export interface IStellarTransactionResponse {
  hash: string;
  ledger: number;
  createdAt: string;
  successful: boolean;
  sourceAccount: string;
  sourceAccountSequence: string;
  feeAccount: string;
  feeCharged: string;
  maxFee: string;
  memoType: string;
  memo: string;
  preconditions: any;
  pagingToken: string;
  envelopeXdr: string;
  operationCount: number;
  operations: IStellarOperationResponse[];
}

export interface IStellarTransactionHistoryResponse {
  count: number;
  hasMore: boolean;
  next?: { cursor: string };
  transactions: IStellarTransactionResponse[];
}
