import { ITransaction } from '@cypherock/db-interfaces';

export interface INotificationState {
  hasUnreadTranscations: boolean;
  hasUnreadNotifications: boolean;
  transactions: ITransaction[];
  isOpen: boolean;
  hasMoreTransactions: boolean;
}
