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
  IInitializeTransactionParams,
  IValidateAddressParams,
} from '@cypherock/coin-support-interfaces';
import { ITransaction } from '@cypherock/db-interfaces';
import { setSolanaWeb3 } from '@cypherock/sdk-app-solana';
import { Observable } from 'rxjs';

import * as operations from './operations';
import { IBroadcastSolanaTransactionParams } from './operations/broadcastTransaction/types';
import { IPrepareSolanaTransactionParams } from './operations/prepareTransaction/types';
import { ISignSolanaTransactionParams } from './operations/signTransaction/types';
import { ISyncSolanaAccountsParams } from './operations/syncAccount/types';
import {
  ICreateSolanaAccountEvent,
  ICreateSolanaAccountParams,
} from './operations/types';
import { setCoinSupportWeb3Lib } from './utils';

export * from './operations/types';
export { updateLogger } from './utils/logger';

export class SolanaSupport implements CoinSupport {
  public static setWeb3Library(web3: any): void {
    setSolanaWeb3(web3);
    setCoinSupportWeb3Lib(web3);
  }

  public receive(params: IReceiveParams) {
    return operations.receive(params);
  }

  public createAccounts(
    params: ICreateSolanaAccountParams,
  ): Observable<ICreateSolanaAccountEvent> {
    return operations.createAccounts(params);
  }

  public syncAccount(params: ISyncSolanaAccountsParams) {
    return operations.syncAccount(params);
  }

  public async initializeTransaction(
    params: IInitializeTransactionParams,
  ): Promise<IPreparedTransaction> {
    return operations.initializeTransaction(params);
  }

  public async prepareTransaction(
    params: IPrepareSolanaTransactionParams,
  ): Promise<IPreparedTransaction> {
    return operations.prepareTransaction(params);
  }

  public signTransaction(
    params: ISignSolanaTransactionParams,
  ): Observable<ISignTransactionEvent> {
    return operations.signTransaction(params);
  }

  public signMessage(): Observable<ISignMessageEvent> {
    throw new Error(`Method not implemented`);
  }

  public broadcastTransaction(
    params: IBroadcastSolanaTransactionParams,
  ): Promise<ITransaction> {
    return operations.broadcastTransaction(params);
  }

  public validateAddress(params: IValidateAddressParams): boolean {
    return operations.validateAddress(params);
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
