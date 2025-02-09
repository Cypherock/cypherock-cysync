import { ILangState } from '@/store';
import { ITransaction } from '@cypherock/db-interfaces';

export const getDisplayTransactionType = (
  t: ITransaction,
  strings: ILangState['strings'],
) => (strings.transactions.transactionStatus as any)[t.type][t.status];
