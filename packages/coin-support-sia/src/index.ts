/* eslint-disable class-methods-use-this */
import {
  CoinSupport,
  ICreateAccountEvent,
  ICreateAccountParams,
  IFormatAddressParams,
  IGetAccountAddressParams,
  IGetAccountHistoryParams,
  IGetAccountHistoryResult,
  IGetCoinAllocationsParams,
  IGetCoinAllocationsResult,
  IGetExplorerLink,
  IInitializeTransactionParams,
  IPreparedTransaction,
  IReceiveEvent,
  IReceiveParams,
  ISignMessageEvent,
  ISignMessageParams,
  ISignTransactionParams,
  ISyncAccountsParams,
  ISyncPriceHistoriesParams,
  ISyncPricesParams,
  IValidateAddressParams,
} from '@cypherock/coin-support-interfaces';
import { ITransaction } from '@cypherock/db-interfaces';
import { Observable } from 'rxjs';

import * as operations from './operations';
import {
  IBroadcastSiaTransactionParams,
  IPrepareSiaTransactionParams,
  ISignSiaTransactionEvent,
} from './operations/types';
import { getAppletId } from './utils';

export * from './operations/types';
export { updateLogger } from './utils/logger';

export class SiaSupport implements CoinSupport {
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
    return operations.initializeTransaction(params);
  }

  public async prepareTransaction(
    params: IPrepareSiaTransactionParams,
  ): Promise<IPreparedTransaction> {
    return operations.prepareTransaction(params);
  }

  public signTransaction(
    params: ISignTransactionParams,
  ): Observable<ISignSiaTransactionEvent> {
    return operations.signTransaction(params);
  }

  public broadcastTransaction(
    params: IBroadcastSiaTransactionParams,
  ): Promise<ITransaction> {
    return operations.broadcastTransaction(params);
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

  public async getAccountAddress(params: IGetAccountAddressParams) {
    return (await operations.getExternalAddress(params)).address;
  }

  public getAppId() {
    return getAppletId();
  }
}
