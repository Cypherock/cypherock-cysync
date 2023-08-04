export const AccountSyncStateMap = {
  syncing: 'syncing',
  synced: 'synced',
  failed: 'failed',
};

export type AccountSyncState =
  (typeof AccountSyncStateMap)[keyof typeof AccountSyncStateMap];

export interface IAccountSyncState {
  syncState: AccountSyncState;
  accountSyncMap: Record<string, AccountSyncState | undefined>;
}
