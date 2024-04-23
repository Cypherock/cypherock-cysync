import {
  SvgProps,
  ArrowReceivedIcon,
  ArrowSentIcon,
} from '@cypherock/cysync-ui';
import {
  ITransaction,
  TransactionType,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';

import { ILangState } from '..';

export const getDisplayTransactionType = (
  t: ITransaction,
  strings: ILangState['strings'],
) => (strings.history.transactionStatus as any)[t.type][t.status];

export const transactionIconMap: Record<TransactionType, React.FC<SvgProps>> = {
  [TransactionTypeMap.receive]: ArrowReceivedIcon,
  [TransactionTypeMap.send]: ArrowSentIcon,
};
