export interface ICantonTransactionParams {
  address: string;
  assetId: string;
  limit?: number;
  forward?: boolean;
  binary?: boolean;
  ledgerIndexMin?: number;
}

interface ICantonResponseTransaction {
  hash: string;
  TransactionType: string;
  Account: string;
  Amount: string;
  Destination: string;
  Fee: string;
  Flags: number;
  LastLedgerSequence: number;
  Sequence: number;
  SigningPubKey: string;
  TxnSignature: string;
  DestinationTag: number;
  SourceTag: number;
  date: number;
  ledger_index: number;
}

export interface IDetailedCantonResponseTransaction {
  meta: {
    TransactionResult: string;
    delivered_amount: string;
  };
  tx: ICantonResponseTransaction;
}

export interface ICantonTransactionResult {
  transactions: IDetailedCantonResponseTransaction[];
  limit: number;
  hasMore: boolean;
  offset?: number;
}
