import { ITransaction } from '@cypherock/db-interfaces';

export interface INotificationState {
  unreadTransactions: number;
  transactions: (ITransaction & { isClicked?: boolean })[];
  isOpen: boolean;
}
