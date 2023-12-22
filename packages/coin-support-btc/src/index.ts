/* eslint-disable class-methods-use-this */
import {
  CoinSupport,
  IGetAccountHistoryParams,
  IGetCoinAllocationsParams,
  IInitializeTransactionParams,
  ISyncPriceHistoriesParams,
  ISyncPricesParams,
  IValidateAddressParams,
  IGetExplorerLink,
  ISignMessageEvent,
  IFormatAddressParams,
} from '@cypherock/coin-support-interfaces';
import { bitcoinJsLibType, setBitcoinJSLib } from '@cypherock/sdk-app-btc';
import { Observable } from 'rxjs';

import * as operations from './operations';
import {
  IBroadcastBtcTransactionParams,
  IBtcReceiveParams,
  ICreateBtcAccountParams,
  IPrepareBtcTransactionParams,
  ISignBtcTransactionParams,
  ISyncBtcAccountsParams,
} from './operations/types';

export * from './operations/types';
export * from './services';
export { updateLogger } from './utils/logger';

export class BtcSupport implements CoinSupport {
  static setBitcoinLibrary(btcLib: bitcoinJsLibType) {
    setBitcoinJSLib(btcLib);
  }

  public createAccounts(params: ICreateBtcAccountParams) {
    return operations.createAccounts(params);
  }

  public receive(params: IBtcReceiveParams) {
    return operations.receive(params);
  }

  public syncAccount(params: ISyncBtcAccountsParams) {
    return operations.syncAccount(params);
  }

  public initializeTransaction(params: IInitializeTransactionParams) {
    return operations.initializeTransaction(params);
  }

  public async prepareTransaction(params: IPrepareBtcTransactionParams) {
    return operations.prepareTransaction(params);
  }

  public signTransaction(params: ISignBtcTransactionParams) {
    return operations.signTransaction(params);
  }

  public signMessage(): Observable<ISignMessageEvent> {
    throw new Error(`Method not implemented`);
  }

  public broadcastTransaction(params: IBroadcastBtcTransactionParams) {
    return operations.broadcastTransaction(params);
  }

  public validateAddress(params: IValidateAddressParams) {
    return operations.validateAddress(params);
  }

  public syncPrices(params: ISyncPricesParams): Observable<void> {
    return operations.syncPrices(params);
  }

  public syncPriceHistories(
    params: ISyncPriceHistoriesParams,
  ): Observable<void> {
    return operations.syncPriceHistories(params);
  }

  public getCoinAllocations(params: IGetCoinAllocationsParams) {
    return operations.getCoinAllocations(params);
  }

  public getAccountHistory(params: IGetAccountHistoryParams) {
    return operations.getAccountHistory(params);
  }

  public getExplorerLink(params: IGetExplorerLink) {
    return operations.getExplorerLink(params);
  }

  public formatAddress(params: IFormatAddressParams) {
    return params.address;
  }
}
