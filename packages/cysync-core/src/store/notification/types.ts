import { ITransaction } from '@cypherock/db-interfaces';

export interface INotificationState {
  hasUnreadTransactions: boolean;
  unreadTransactions: number;
  transactions: (ITransaction & { isClicked?: boolean })[];
  isOpen: boolean;
}
