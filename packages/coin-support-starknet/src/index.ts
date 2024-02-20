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
  ISyncAccountsParams,
  IInitializeTransactionParams,
  ISignTransactionParams,
} from '@cypherock/coin-support-interfaces';
import { ITransaction } from '@cypherock/db-interfaces';
import {
  starknetApiJsLibType,
  setStarknetApiJs,
} from '@cypherock/sdk-app-starknet';
import { Observable } from 'rxjs';

import * as operations from './operations';
import {
  IBroadcastStarknetTransactionParams,
  ICreateStarknetAccountParams,
  IPrepareStarknetTransactionParams,
} from './operations/types';

export * from './operations/types';
export * from './services';

export { updateLogger } from './utils/logger';

export class StarknetSupport implements CoinSupport {
  public static setStarknetApiJs(api: starknetApiJsLibType): void {
    setStarknetApiJs(api);
  }

  public receive(params: IReceiveParams) {
    return operations.receive(params);
  }

  public createAccounts(params: ICreateStarknetAccountParams) {
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
    params: IPrepareStarknetTransactionParams,
  ): Promise<IPreparedTransaction> {
    return operations.prepareTransaction(params);
  }

  public signTransaction(
    params: ISignTransactionParams,
  ): Observable<ISignTransactionEvent> {
    return operations.signTransaction(params);
  }

  public signMessage(): Observable<ISignMessageEvent> {
    throw new Error(`Method not implemented`);
  }

  public broadcastTransaction(
    params: IBroadcastStarknetTransactionParams,
  ): Promise<ITransaction> {
    return operations.broadcastTransaction(params);
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
