/* eslint-disable class-methods-use-this */
import {
  CoinSupport,
  IPreparedTransaction,
  IReceiveEvent,
  IReceiveParams,
  ISignTransactionEvent,
  ISyncPricesParams,
  ICreateAccountEvent,
} from '@cypherock/coin-support-interfaces';
import { ITransaction } from '@cypherock/db-interfaces';
import { Observable } from 'rxjs';

import * as operations from './operations';

export { updateLogger } from './utils/logger';

export class NearSupport implements CoinSupport {
  public receive(params: IReceiveParams): Observable<IReceiveEvent> {
    throw new Error(`Method not implemented. ${params}`);
  }

  public createAccounts(): Observable<ICreateAccountEvent> {
    throw new Error('Not implemented');
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

  public validateAddress(): boolean {
    throw new Error(`Method not implemented`);
  }

  public syncPrices(params: ISyncPricesParams) {
    return operations.syncPrices(params);
  }
}
