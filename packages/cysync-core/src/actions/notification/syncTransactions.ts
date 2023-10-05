import { TransactionTypeMap } from '@cypherock/db-interfaces';
import { createAsyncThunk } from '@reduxjs/toolkit';
import lodash from 'lodash';

import { RootState, setTransactionNotifications } from '~/store';

const getTransactionsNotifications = async (state: RootState) => {
  const transactions = state.transaction.transactions.filter(t => {
    if (t.type === TransactionTypeMap.hidden) {
      return false;
    }

    const account = state.account.accounts.find(a => a.__id === t.accountId);
    if (!account || !account.meta?.created) {
      return false;
    }

    // if (t.timestamp < account.meta.created) {
    //   return false;
    // }

    return true;
  });

  return {
    transactions: lodash.sortBy(transactions, t => t.timestamp).slice(0, 5),
    hasMore: transactions.length > 5,
  };
};

export const syncTransactionNotifications = createAsyncThunk<
  void,
  void,
  { state: RootState }
>('notification/syncTransactions', async (_params, { dispatch, getState }) => {
  const { transactions, hasMore } = await getTransactionsNotifications(
    getState(),
  );
  dispatch(setTransactionNotifications({ transactions, hasMore }));
});
