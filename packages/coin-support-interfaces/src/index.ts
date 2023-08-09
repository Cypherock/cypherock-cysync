import { ITransaction } from '@cypherock/db-interfaces';
import { Observable } from 'rxjs';

import { ICreateAccountEvent, ICreateAccountParams } from './createAccount';
import { IReceiveEvent, IReceiveParams } from './receive';
import {
  IBroadcastTransactionParams,
  IInitializeTransactionParams,
  IPreparedTransaction,
  IPrepareTransactionParams,
  ISignTransactionEvent,
  ISignTransactionParams,
} from './send';
import { ISyncAccountsParams } from './syncAccount';
import { IValidateAddressParams } from './validateAddress';

export * from './createAccount';
export * from './receive';
export * from './send';
export * from './syncAccount';
export * from './schemes';
export * from './validateAddress';

export interface CoinSupport {
  createAccounts(params: ICreateAccountParams): Observable<ICreateAccountEvent>;
  receive(params: IReceiveParams): Observable<IReceiveEvent>;
  syncAccounts(params: ISyncAccountsParams): Observable<void>;
  initializeTransaction(
    params: IInitializeTransactionParams,
  ): Promise<IPreparedTransaction>;
  prepareTransaction(params: IPrepareTransactionParams): Promise<any>;
  validateAddress(params: IValidateAddressParams): boolean;
  signTransaction(
    params: ISignTransactionParams,
  ): Observable<ISignTransactionEvent>;
  broadcastTransaction(
    params: IBroadcastTransactionParams,
  ): Promise<ITransaction>;
}
