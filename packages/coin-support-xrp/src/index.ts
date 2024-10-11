/* eslint-disable class-methods-use-this */
import {
  CoinSupport,
  IBroadcastTransactionParams,
  ICreateAccountEvent,
  ICreateAccountParams,
  IFormatAddressParams,
  IGetAccountHistoryParams,
  IGetAccountHistoryResult,
  IGetCoinAllocationsParams,
  IGetCoinAllocationsResult,
  IGetExplorerLink,
  IInitializeTransactionParams,
  IPreparedTransaction,
  IPrepareTransactionParams,
  IReceiveEvent,
  IReceiveParams,
  ISignMessageEvent,
  ISignMessageParams,
  ISignTransactionEvent,
  ISignTransactionParams,
  ISyncAccountsParams,
  ISyncPriceHistoriesParams,
  ISyncPricesParams,
  IValidateAddressParams,
} from '@cypherock/coin-support-interfaces';
import { ITransaction } from '@cypherock/db-interfaces';
import { setXrpLib } from '@cypherock/sdk-app-xrp';
import { Observable } from 'rxjs';

import * as operations from './operations';

import { setCoinSupportXrpLib } from './utils';

export { updateLogger } from './utils/logger';

export class XrpSupport implements CoinSupport {
  public static setXrpLib(xrplib: any): void {
    setXrpLib(xrplib);
    setCoinSupportXrpLib(xrplib);
  }

  public receive(params: IReceiveParams): Observable<IReceiveEvent> {
    return operations.receive(params);
  }

  public createAccounts(
    params: ICreateAccountParams,
  ): Observable<ICreateAccountEvent> {
    return operations.createAccounts(params);
  }

  public syncAccount(params: ISyncAccountsParams): Observable<void> {
    return operations.syncAccount(params);
  }

  public async initializeTransaction(
    params: IInitializeTransactionParams,
  ): Promise<IPreparedTransaction> {
    throw new Error(`Method not implemented Params: ${params}`);
  }

  public async prepareTransaction(
    params: IPrepareTransactionParams,
  ): Promise<IPreparedTransaction> {
    throw new Error(`Method not implemented Params: ${params}`);
  }

  public signTransaction(
    params: ISignTransactionParams,
  ): Observable<ISignTransactionEvent<any>> {
    throw new Error(`Method not implemented Params: ${params}`);
  }

  public broadcastTransaction(
    params: IBroadcastTransactionParams<any>,
  ): Promise<ITransaction> {
    throw new Error(`Method not implemented Params: ${params}`);
  }

  public signMessage(
    params: ISignMessageParams,
  ): Observable<ISignMessageEvent> {
    throw new Error(`Method not implemented Params: ${params}`);
  }

  public getCoinAllocations(
    params: IGetCoinAllocationsParams,
  ): Promise<IGetCoinAllocationsResult> {
    return operations.getCoinAllocations(params);
  }

  public getAccountHistory(
    params: IGetAccountHistoryParams,
  ): Promise<IGetAccountHistoryResult> {
    return operations.getAccountHistory(params);
  }

  public validateAddress(params: IValidateAddressParams): boolean {
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

  public getExplorerLink(params: IGetExplorerLink): string {
    return operations.getExplorerLink(params);
  }

  public formatAddress(params: IFormatAddressParams): string {
    return params.address;
  }
}
