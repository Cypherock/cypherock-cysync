export interface ICantonTransactionParams {
  partyId: string;
  assetId: string;
  afterOffset?: number;
}

interface ICantonBaseResponseTransaction {
  updateId: string;
  offset: number;
  recordTime: string;
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

export interface ICantonResponseTransaction
  extends ICantonBaseResponseTransaction {
  type: string;
  choice: string;
}

export interface ICantonPendingResponseTransaction
  extends ICantonBaseResponseTransaction {
  contractId: string;
  templateId: string;
}

export interface ICantonTransactionResult {
  transactions: ICantonResponseTransaction[];
  count: number;
  hasMore: boolean;
  nextOffset?: number;
}

export interface ICantonPrepareExternalPartyTxnResult {
  partyId: string;
  publicKeyFingerprint: string;
  multiHash: string;
  topologyTransactions: string[];
}
