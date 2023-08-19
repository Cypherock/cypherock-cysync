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
} from '@cypherock/coin-support-interfaces';
import { ITransaction } from '@cypherock/db-interfaces';
import { ethersLibType, setEthersLib } from '@cypherock/sdk-app-evm';
import { Observable } from 'rxjs';

import * as operations from './operations';
import { ICreateEvmAccountParams } from './operations/types';

export * from './operations/types';
export { updateLogger } from './utils/logger';

export class EvmSupport implements CoinSupport {
  public receive(params: IReceiveParams): Observable<IReceiveEvent> {
    throw new Error(`Method not implemented. ${params}`);
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
