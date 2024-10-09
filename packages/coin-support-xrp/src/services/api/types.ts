export interface IXrpTransactionParams {
  address: string;
  assetId: string;
  limit?: number;
  forward?: boolean;
  binary?: boolean;
}

export interface IXrpTransactionResult {
  transactions: any[];
}
