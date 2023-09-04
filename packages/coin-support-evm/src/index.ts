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
} from '@cypherock/coin-support-interfaces';
import { ITransaction } from '@cypherock/db-interfaces';
import { ethersLibType, setEthersLib } from '@cypherock/sdk-app-evm';
import { Observable } from 'rxjs';

import * as operations from './operations';
import { ICreateEvmAccountParams } from './operations/types';

export * from './operations/types';
export * from './services';

export { updateLogger } from './utils/logger';

export class EvmSupport implements CoinSupport {
  public receive(params: IReceiveParams): Observable<IReceiveEvent> {
    return operations.receive(params);
  }

  public createAccounts(params: ICreateEvmAccountParams) {
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

  public broadcastTransaction(): Promise<ITransaction> {
    throw new Error(`Method not implemented`);
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

  public static setEthersLibrary(ethers: ethersLibType): void {
    setEthersLib(ethers);
  }
}
