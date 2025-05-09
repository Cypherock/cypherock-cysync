export interface IIcpTransactionHistoryResponseTransaction {
  id: string;
  operation: string;
  from?: string;
  to?: string;
  amount: string;
  fee: string;
  timestamp: string;
  memo?: string;
}

export interface IIcpTransactionHistoryResponse {
  hasMore: boolean;
  count: number;
  transactions: IIcpTransactionHistoryResponseTransaction[];
}
