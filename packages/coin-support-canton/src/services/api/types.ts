export interface ICantonTransactionHistoryParams {
  partyId: string;
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

export interface ICantonPrepareExternalPartyTxnParams {
  publicKey: string;
  partyId: string;
}

export interface ICantonPrepareExternalPartyTxnResult {
  partyId: string;
  publicKeyFingerprint: string;
  multiHash: string;
  topologyTransactions: string[];
}

export interface ICantonBroadcastExternalPartyTxnParams {
  signature: string;
  preparedParty: ICantonPrepareExternalPartyTxnResult;
}

export interface ICantonPrepareSendTxnParams {
  partyId: string;
  receiverPartyId: string;
  amount: string;
  memo?: string;
  expiryDate?: string;
}

export interface ICantonPrepareChoiceTxnParams {
  partyId: string;
  transferContractId: string;
}

export interface ICantonBroadcastTxnParams {
  partyId: string;
  signature: string;
  publicKey: string;
  preparedTransaction: any;
}
