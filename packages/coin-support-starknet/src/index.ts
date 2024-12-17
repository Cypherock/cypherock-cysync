/* eslint-disable class-methods-use-this */
import {
  CoinSupport,
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
  IReceiveEvent,
  IReceiveParams,
  ISignMessageEvent,
  ISignMessageParams,
  ISyncAccountsParams,
  ISyncPriceHistoriesParams,
  ISyncPricesParams,
  IValidateAddressParams,
} from '@cypherock/coin-support-interfaces';
import { ITransaction } from '@cypherock/db-interfaces';
import { setStarknetApiJs } from '@cypherock/sdk-app-starknet';
import { Observable } from 'rxjs';

import * as operations from './operations';
import {
  IBroadcastStarknetTransactionParams,
  IPreparedStarknetTransaction,
  IPrepareStarknetTransactionParams,
  ISignStarknetTransactionEvent,
  ISignStarknetTransactionParams,
} from './operations/types';
import { setCoinSupportStarknetLib, StarknetLibType } from './utils';

export * from './operations/types';
export { updateLogger } from './utils/logger';

export class StarknetSupport implements CoinSupport {
  public static setStarknetLib(starknetLib: StarknetLibType): void {
    setStarknetApiJs(starknetLib);
    setCoinSupportStarknetLib(starknetLib);
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
    params: IPrepareStarknetTransactionParams,
  ): Promise<IPreparedStarknetTransaction> {
    return operations.prepareTransaction(params);
  }

  public signTransaction(
    params: ISignStarknetTransactionParams,
  ): Observable<ISignStarknetTransactionEvent> {
    return operations.signTransaction(params);
  }

  public broadcastTransaction(
    params: IBroadcastStarknetTransactionParams,
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
}
