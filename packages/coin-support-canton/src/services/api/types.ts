export interface ICantonTransactionParams {
  partyId: string;
  assetId: string;
  afterOffset?: number;
}

export interface ICantonResponseTransaction {
  updateId: string;
  offset: number;
  recordTime: string;
  type: string;
  choice: string;
  status: string;
  sender: string;
  receiver: string;
  amount: string;
  fees: string;
  instrumentId: {
    id: string;
    admin: string;
  };
  requestedAt: string;
  executeBefore: string;
  memo: string;
}

export interface ICantonTransactionResult {
  transactions: ICantonResponseTransaction[];
  count: number;
  hasMore: boolean;
  nextOffset?: number;
}
