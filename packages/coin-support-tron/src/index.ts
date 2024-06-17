/* eslint-disable class-methods-use-this */
import {
  CoinSupport,
  ICreateAccountEvent,
  IGetAccountHistoryParams,
  IGetCoinAllocationsParams,
  IGetExplorerLink,
  IPreparedTransaction,
  IReceiveEvent,
  IReceiveParams,
  ISignMessageEvent,
  ISignTransactionEvent,
  ISyncPriceHistoriesParams,
  ISyncPricesParams,
  IValidateAddressParams,
} from '@cypherock/coin-support-interfaces';
import { ITransaction } from '@cypherock/db-interfaces';
import { Observable } from 'rxjs';

import * as operations from './operations';
import {
  ICreateTronAccountParams,
  ISyncTronAccountsParams,
} from './operations/types';

export * from './operations/types';
export * from './services';

export { updateLogger } from './utils/logger';

export class TronSupport implements CoinSupport {
  public receive(params: IReceiveParams): Observable<IReceiveEvent> {
    return operations.receive(params);
  }

  public createAccounts(
    params: ICreateTronAccountParams,
  ): Observable<ICreateAccountEvent> {
    return operations.createAccounts(params);
  }

  public syncAccount(params: ISyncTronAccountsParams) {
    return operations.syncAccount(params);
  }

  public async initializeTransaction(): Promise<IPreparedTransaction> {
    throw new Error(`Method not implemented`);
  }

  public async prepareTransaction(): Promise<IPreparedTransaction> {
    throw new Error(`Method not implemented`);
  }

  public signTransaction(): Observable<ISignTransactionEvent> {
    throw new Error(`Method not implemented`);
  }

  public signMessage(): Observable<ISignMessageEvent> {
    throw new Error(`Method not implemented`);
  }

  public broadcastTransaction(): Promise<ITransaction> {
    throw new Error(`Method not implemented`);
  }

  public getCoinAllocations(params: IGetCoinAllocationsParams) {
    return operations.getCoinAllocations(params);
  }

  public getAccountHistory(params: IGetAccountHistoryParams) {
    return operations.getAccountHistory(params);
  }

  public validateAddress(params: IValidateAddressParams) {
    return operations.validateAddress(params);
  }

  public syncPrices(params: ISyncPricesParams) {
    return operations.syncPrices(params);
  }

  public syncPriceHistories(params: ISyncPriceHistoriesParams) {
    return operations.syncPriceHistories(params);
  }

  public getExplorerLink(params: IGetExplorerLink) {
    return operations.getExplorerLink(params);
  }

  public formatAddress(): string {
    throw new Error(`Method not implemented`);
  }
}
