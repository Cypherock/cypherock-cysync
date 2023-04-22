export type AccountSortOption =
  | 'account'
  | 'wallet'
  | 'sync'
  | 'amount'
  | 'value';

export interface IAccountDisplayInfo {
  name: string;
  assetName: string;
  derivationPath: string;
  assetSymbol: string;
  value: string; // balance in USD
  amount: string; // balance in asset's currency
  childrenAccounts: IAccountDisplayInfo[]; // tokens or custom accounts
}
