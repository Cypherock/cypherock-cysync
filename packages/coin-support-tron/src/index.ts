/* eslint-disable class-methods-use-this */
import {
  CoinSupport,
  ICreateAccountEvent,
  IFormatAddressParams,
  IGetAccountHistoryParams,
  IGetCoinAllocationsParams,
  IGetExplorerLink,
  IInitializeTransactionParams,
  IPreparedTransaction,
  IReceiveEvent,
  IReceiveParams,
  ISignMessageEvent,
  ISyncPriceHistoriesParams,
  ISyncPricesParams,
  IValidateAddressParams,
} from '@cypherock/coin-support-interfaces';
import { ITransaction } from '@cypherock/db-interfaces';
import { setTronWeb } from '@cypherock/sdk-app-tron';
import { Observable } from 'rxjs';

import * as operations from './operations';
import {
  IBroadcastTronTransactionParams,
  ICreateTronAccountParams,
  IPrepareTronTransactionParams,
  ISignTronTransactionEvent,
  ISignTronTransactionParams,
  ISyncTronAccountsParams,
} from './operations/types';
import { setCoinSupportTronWeb } from './utils';

export * from './operations/types';
export * from './services';

export { updateLogger } from './utils/logger';

export class TronSupport implements CoinSupport {
  public static setTronWeb(tronweb: any): void {
    setTronWeb(tronweb);
    setCoinSupportTronWeb(tronweb);
  }

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

  public async initializeTransaction(
    params: IInitializeTransactionParams,
  ): Promise<IPreparedTransaction> {
    return operations.initializeTransaction(params);
  }

  public async prepareTransaction(
    params: IPrepareTronTransactionParams,
  ): Promise<IPreparedTransaction> {
    return operations.prepareTransaction(params);
  }

  public signTransaction(
    params: ISignTronTransactionParams,
  ): Observable<ISignTronTransactionEvent> {
    return operations.signTransaction(params);
  }

  public signMessage(): Observable<ISignMessageEvent> {
    throw new Error(`Method not implemented`);
  }

  public broadcastTransaction(
    params: IBroadcastTronTransactionParams,
  ): Promise<ITransaction> {
    return operations.broadcastTransaction(params);
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

  public formatAddress(params: IFormatAddressParams) {
    return operations.formatAddress(params);
  }
}
