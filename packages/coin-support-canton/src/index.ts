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
import { CantonLib, setCantonLib } from '@cypherock/sdk-app-canton';
import { Observable } from 'rxjs';

import * as operations from './operations';
import {
  IBroadcastCantonTransactionParams,
  IPrepareCantonTransactionParams,
  ISignCantonTransactionEvent,
} from './operations/types';
import { getAppletId } from './utils';
import {
  IPrepareCantonChoiceTransactionParams,
  IPreparedCantonChoiceTransaction,
} from './operations/prepareChoiceTransaction/types';

export * from './operations/types';
export { updateLogger } from './utils/logger';

export class CantonSupport implements CoinSupport {
  public static setCantonLib(cantonlib: CantonLib): void {
    setCantonLib(cantonlib);
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
    return operations.initializeTransaction(params);
  }

  public async prepareTransaction(
    params: IPrepareCantonTransactionParams,
  ): Promise<IPreparedTransaction> {
    return operations.prepareTransaction(params);
  }

  public async prepareChoiceTransaction(
    params: IPrepareCantonChoiceTransactionParams,
  ): Promise<IPreparedCantonChoiceTransaction> {
    return operations.prepareChoiceTransaction(params);
  }

  public signTransaction(
    params: ISignTransactionParams,
  ): Observable<ISignCantonTransactionEvent> {
    return operations.signTransaction(params);
  }

  public broadcastTransaction(
    params: IBroadcastCantonTransactionParams,
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
