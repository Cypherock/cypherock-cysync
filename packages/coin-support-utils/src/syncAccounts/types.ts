import { ISyncAccountsParams } from '@cypherock/coin-support-interfaces';
import { IAccount, ITransaction } from '@cypherock/db-interfaces';

export interface IGetAddressDetailsResult<T> {
  transactions: ITransaction[];
  updatedAccountInfo: Partial<IAccount>;
  hasMore: boolean;
  nextIterationContext: T;
}

export interface IGetAddressDetailsParams<T> extends ISyncAccountsParams {
  account: IAccount;
  iterationContext: T | undefined;
}

export type IGetAddressDetails<T> = (
  params: IGetAddressDetailsParams<T>,
) => Promise<IGetAddressDetailsResult<T>>;

export interface ICreateSyncAccountsObservableParams<T>
  extends ISyncAccountsParams {
  getAddressDetails: IGetAddressDetails<T>;
}
