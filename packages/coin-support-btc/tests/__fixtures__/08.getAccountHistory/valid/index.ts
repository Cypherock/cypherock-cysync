import { withOneTransactionForMonth } from './withOneTransactionForMonth';
import { withOneTransactionForYear } from './withOneTransactionForYear';
import { withMultipleTransactionsForYear } from './withMultipleTransactionsForYear';

export const valid = [
  withOneTransactionForMonth,
  withOneTransactionForYear,
  withMultipleTransactionsForYear,
];
