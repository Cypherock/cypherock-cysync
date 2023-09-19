/* eslint-disable class-methods-use-this */
import {
  CoinSupport,
  IPreparedTransaction,
  IReceiveEvent,
  IReceiveParams,
  IValidateAddressParams,
  ISignTransactionEvent,
  ISyncPricesParams,
  ISyncPriceHistoriesParams,
  IGetCoinAllocationsParams,
  IGetAccountHistoryParams,
  IGetExplorerLink,
  IInitializeTransactionParams,
  ISyncAccountsParams,
} from '@cypherock/coin-support-interfaces';
import { ITransaction } from '@cypherock/db-interfaces';
import { ethersLibType, setEthersLib } from '@cypherock/sdk-app-evm';
import { Observable } from 'rxjs';

import * as operations from './operations';
import { ICreateEvmAccountParams } from './operations/types';
import { setCoinSupportEthersLib } from './utils';
import { IPrepareEvmTransactionParams } from './operations/prepareTransaction/types';
import { ISignEvmTransactionParams } from './operations/signTransaction/types';
import { IBroadcastEvmTransactionParams } from './operations/broadcastTransaction/types';

export * from './operations/types';
export * from './services';

export { updateLogger } from './utils/logger';

export class EvmSupport implements CoinSupport {
  public static setEthersLibrary(ethers: ethersLibType): void {
    setEthersLib(ethers);
    setCoinSupportEthersLib(ethers);
  }

  public receive(params: IReceiveParams): Observable<IReceiveEvent> {
    return operations.receive(params);
  }

  public createAccounts(params: ICreateEvmAccountParams) {
    return operations.createAccounts(params);
  }

  public syncAccount(params: ISyncAccountsParams) {
    return operations.syncAccount(params);
  }

  public async initializeTransaction(
    params: IInitializeTransactionParams,
  ): Promise<IPreparedTransaction> {
    return operations.initializeTransaction(params);
  }

  public async prepareTransaction(
    params: IPrepareEvmTransactionParams,
  ): Promise<IPreparedTransaction> {
    return operations.prepareTransaction(params);
  }

  public signTransaction(
    params: ISignEvmTransactionParams,
  ): Observable<ISignTransactionEvent> {
    return operations.signTransaction(params);
  }

  public broadcastTransaction(
    params: IBroadcastEvmTransactionParams,
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
}
