import {
  SvgProps,
  ArrowReceivedIcon,
  ArrowSentIcon,
} from '@cypherock/cysync-ui';
import {
  ITransaction,
  TransactionType,
  TransactionTypeMap,
  TransactionStatus,
  TransactionStatusMap,
} from '@cypherock/db-interfaces';

import { ILangState } from '..';

export const getTransactionTypeToStringMap = (
  strings: ILangState['strings'],
): Record<TransactionType, string> => ({
  [TransactionTypeMap.receive]: strings.history.transactionType.receive,
  [TransactionTypeMap.send]: strings.history.transactionType.send,
});

export const getTransactionStatusToStringMap = (
  strings: ILangState['strings'],
): Record<TransactionStatus, string> => ({
  [TransactionStatusMap.success]: '',
  [TransactionStatusMap.pending]: strings.history.transactionType.pending,
  [TransactionStatusMap.failed]: strings.history.transactionType.failed,
});

export const getDisplayTransactionType = (
  t: ITransaction,
  strings: ILangState['strings'],
) => {
  const transactionTypeToStringMap = getTransactionTypeToStringMap(strings);
  const transactionStatusToStringMap = getTransactionStatusToStringMap(strings);

  let text = transactionTypeToStringMap[t.type];

  if (transactionStatusToStringMap[t.status]) {
    text += ` ${transactionStatusToStringMap[t.status]}`;
  }

  return text;
};

export const transactionIconMap: Record<TransactionType, React.FC<SvgProps>> = {
  [TransactionTypeMap.receive]: ArrowReceivedIcon,
  [TransactionTypeMap.send]: ArrowSentIcon,
};
