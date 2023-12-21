export const AccountSyncStateMap = {
  syncing: 'syncing',
  synced: 'synced',
  failed: 'failed',
};

export type AccountSyncState =
  (typeof AccountSyncStateMap)[keyof typeof AccountSyncStateMap];

export interface IndividualAccountSyncStatus {
  syncState?: AccountSyncState;
  lastSyncedAt?: number;
}

export interface IAccountSyncState {
  syncState: AccountSyncState;
  accountSyncMap: Record<string, IndividualAccountSyncStatus | undefined>;
  lastSyncedAt?: number;
  syncError?: string;
}
