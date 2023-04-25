import type { IAddressInfo } from '../entities/transaction';

export interface IHistoryItemInfo {
  accountName: string;
  walletName: string;
  assetName: string;
  assetSymbol: string;
  value: string; // balance in USD
  amount: string; // balance in asset's currency
  time: 'string'; // Human readable format
  transactionType: 'receive' | 'send' | 'swap';
  status: 'success' | 'failed' | 'pending';
  sender: IAddressInfo[];
  receiver: IAddressInfo[];
  extraInfo: Record<string, string>; // Need something like this to display details for specific coins
  // Swap UI may be different, we might want to update this accordingly
}
