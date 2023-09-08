import {
  SvgProps,
  ArrowReceivedIcon,
  ArrowSentIcon,
} from '@cypherock/cysync-ui/src';
import {
  ITransaction,
  TransactionType,
  TransactionTypeMap,
  TransactionStatus,
  TransactionStatusMap,
} from '@cypherock/db-interfaces';

import { ILangState } from '..';

export const getDisplayTransactionType = (
  t: ITransaction,
  strings: ILangState['strings'],
) => {
  const typeMap: Record<TransactionType, string> = {
    [TransactionTypeMap.receive]: strings.history.transactionType.receive,
    [TransactionTypeMap.send]: strings.history.transactionType.send,
  };

  const statusMap: Record<TransactionStatus, string> = {
    [TransactionStatusMap.success]: '',
    [TransactionStatusMap.pending]: strings.history.transactionType.pending,
    [TransactionStatusMap.failed]: strings.history.transactionType.failed,
  };

  let text = typeMap[t.type];

  if (statusMap[t.status]) {
    text += ` ${statusMap[t.status]}`;
  }

  return text;
};

export const transactionIconMap: Record<TransactionType, React.FC<SvgProps>> = {
  [TransactionTypeMap.receive]: ArrowReceivedIcon,
  [TransactionTypeMap.send]: ArrowSentIcon,
};
