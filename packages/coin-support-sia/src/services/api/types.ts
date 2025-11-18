export interface ISiaTransactionHistory {
  id: string;
  type: 'send' | 'receive';
  amount: string;
  fee?: string;
  timestamp: string;
  confirmations: number;
  blockHeight: number;
  toAddress?: string;
  fromAddress?: string;
}

export interface ISiaHistoryResponse {
  transactions: ISiaTransactionHistory[];
  hasMore: boolean;
}

export interface ISiaUtxo {
  id: string;
  value: string;
}

export interface ISiaUtxoResponse {
  utxos: ISiaUtxo[];
  count: number;
}

export interface ISiaOutput {
  address: string;
  value: string;
}

export interface IBroadcastRequest {
  selectedUtxos: string[];
  outputs: ISiaOutput[];
  fee: string;
  signature: string;
  publicKey: string;
  fromAddress: string;
}

export interface ISiaBroadcastResponse {
  success: boolean;
  hash?: string;
  error?: string;
}
