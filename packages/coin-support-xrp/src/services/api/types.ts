export interface IXrpTransactionParams {
  address: string;
  assetId: string;
  limit?: number;
  forward?: boolean;
  binary?: boolean;
  ledgerIndexMin?: number;
}

interface IXrpResponseTransaction {
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

export interface IDetailedXrpResponseTransaction {
  meta: {
    TransactionResult: string;
    delivered_amount: string;
  };
  tx: IXrpResponseTransaction;
}

export interface IXrpTransactionResult {
  account: string;
  transactions: IDetailedXrpResponseTransaction[];
  limit: number;
  marker: {
    ledger: number;
  };
}
