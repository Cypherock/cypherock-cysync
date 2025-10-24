export interface ISiaTransactionHistory {
  id: string;
  type: 'send' | 'receive';
  amount: string;
  fee?: string;
  timestamp: string;
  confirmations: number;
  toAddress?: string;
  fromAddress?: string;
}

export interface ISiaHistoryResponse {
  transactions: ISiaTransactionHistory[];
  count: number;
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
  url?: string;
  error?: string;
}
