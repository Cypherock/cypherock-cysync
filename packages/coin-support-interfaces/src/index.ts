import { ITransaction } from '@cypherock/db-interfaces';
import { Observable } from 'rxjs';

import { ICreateAccountEvent, ICreateAccountParams } from './createAccount';
import { IGetExplorerLink } from './explorer';
import {
  IGetAccountHistoryParams,
  IGetAccountHistoryResult,
} from './getAccountHistory';
import {
  IGetCoinAllocationsParams,
  IGetCoinAllocationsResult,
} from './getCoinAllocations';
import { IReceiveEvent, IReceiveParams } from './receive';
import {
  IBroadcastTransactionParams,
  IInitializeTransactionParams,
  IPreparedTransaction,
  IPrepareTransactionParams,
  ISignTransactionEvent,
  ISignTransactionParams,
} from './send';
import { ISyncAccountsParams } from './syncAccount';
import { ISyncPriceHistoriesParams } from './syncPriceHistories';
import { ISyncPricesParams } from './syncPrices';
import { IValidateAddressParams } from './validateAddress';

export * from './createAccount';
export * from './receive';
export * from './send';
export * from './syncAccount';
export * from './schemes';
export * from './validateAddress';
export * from './syncPrices';
export * from './syncPriceHistories';
export * from './getCoinAllocations';
export * from './getAccountHistory';
export * from './explorer';

export interface CoinSupport {
  createAccounts(params: ICreateAccountParams): Observable<ICreateAccountEvent>;
  receive(params: IReceiveParams): Observable<IReceiveEvent>;
  syncAccount(params: ISyncAccountsParams): Observable<void>;
  /**
   * Fetch data for transaction before transaction preparation.
   * For instance fetching average fee. For Bitcoin UTXOs can be fetched.
   * Creates a PreparedTransaction object with static data.
   */
  initializeTransaction(
    params: IInitializeTransactionParams,
  ): Promise<IPreparedTransaction>;
  /**
   * Takes the PreparedTransaction created by initializeTransaction and returns
   * an updated object PreparedTransaction containing computed data.
   */
  prepareTransaction(params: IPrepareTransactionParams): Promise<any>;
  validateAddress(params: IValidateAddressParams): boolean;
  signTransaction(
    params: ISignTransactionParams,
  ): Observable<ISignTransactionEvent>;
  broadcastTransaction(
    params: IBroadcastTransactionParams,
  ): Promise<ITransaction>;
  syncPrices(params: ISyncPricesParams): Observable<void>;
  syncPriceHistories(params: ISyncPriceHistoriesParams): Observable<void>;
  getCoinAllocations(
    params: IGetCoinAllocationsParams,
  ): Promise<IGetCoinAllocationsResult>;
  getAccountHistory(
    params: IGetAccountHistoryParams,
  ): Promise<IGetAccountHistoryResult>;
  getExplorerLink(params: IGetExplorerLink): string;
}
