import {
  IGetAccountHistoryParams,
  IBalanceHistory,
} from '@cypherock/coin-support-interfaces';

export interface IPrepareTransactionTestCases {
  name: string;
  params: Omit<IGetAccountHistoryParams, 'db'>;
  output: { history: IBalanceHistory[] };
}
