export interface IStellarTransactionParams {
  address: string;
  assetId: string;
  limit?: number;
  cursor?: string;
}

export enum StellarMemoType {
  NONE = 'none',
  TEXT = 'text',
  ID = 'id',
  HASH = 'hash',
  RETURN = 'return',
}

export interface IStellarMemo {
  type: StellarMemoType;
  value?: string; // Will store text, ID (as string), or hash (as hex string)
}

interface IStellarResponseTransaction {
  hash: string;
  source_account: string;
  fee_charged: string;
  ledger: number;
  memo_type?: string;
  memo?: string;
  operations: {
    type: string;
    from: string;
    to: string;
    amount: string;
  }[];
  sequence: number;
  date: number;
}

export interface IDetailedStellarResponseTransaction {
  memo_type?: string;
  memo?: string;
  meta: {
    TransactionResult: string;
    delivered_amount: string;
  };
  tx: IStellarResponseTransaction;
}

export interface IStellarTransactionResult {
  account: string;
  transactions: IDetailedStellarResponseTransaction[];
  limit: number;
  marker: {
    ledger: number;
  };
}
