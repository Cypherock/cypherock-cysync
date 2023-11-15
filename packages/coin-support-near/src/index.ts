/* eslint-disable class-methods-use-this */
import {
  CoinSupport,
  IPreparedTransaction,
  IReceiveParams,
  ISignTransactionEvent,
  ISyncPricesParams,
  ISyncPriceHistoriesParams,
  IGetCoinAllocationsParams,
  IGetAccountHistoryParams,
  IGetExplorerLink,
  ISignMessageEvent,
  IFormatAddressParams,
} from '@cypherock/coin-support-interfaces';
import { ITransaction } from '@cypherock/db-interfaces';
import { nearApiJsLibType, setNearApiJs } from '@cypherock/sdk-app-near';
import { Observable } from 'rxjs';

import * as operations from './operations';
import { ICreateNearAccountParams } from './operations/types';

export * from './operations/types';
export * from './services';

export { updateLogger } from './utils/logger';

export class NearSupport implements CoinSupport {
  public static setNearApiJs(api: nearApiJsLibType): void {
    setNearApiJs(api);
  }

  public receive(params: IReceiveParams) {
    return operations.receive(params);
  }

  public createAccounts(params: ICreateNearAccountParams) {
    return operations.createAccounts(params);
  }

  public syncAccount(): Observable<void> {
    throw new Error('Not implemented');
  }

  public async initializeTransaction(): Promise<IPreparedTransaction> {
    throw new Error('Not implemented');
  }

  public async prepareTransaction(): Promise<IPreparedTransaction> {
    throw new Error('Not implemented');
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

  public validateAddress(): boolean {
    throw new Error(`Method not implemented`);
  }

  public getCoinAllocations(params: IGetCoinAllocationsParams) {
    return operations.getCoinAllocations(params);
  }

  public getAccountHistory(params: IGetAccountHistoryParams) {
    return operations.getAccountHistory(params);
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
    return params.address;
  }
}
