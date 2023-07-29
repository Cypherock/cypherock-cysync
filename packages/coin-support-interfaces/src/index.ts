import { Observable } from 'rxjs';

import { ICreateAccountEvent, ICreateAccountParams } from './createAccount';
import { IReceiveEvent, IReceiveParams } from './receive';
import { ISyncAccountsParams } from './syncAccount';

export * from './createAccount';
export * from './receive';
export * from './syncAccount';
export * from './schemes';

export interface CoinSupport {
  createAccounts(params: ICreateAccountParams): Observable<ICreateAccountEvent>;
  receive(params: IReceiveParams): Observable<IReceiveEvent>;
  syncAccounts(params: ISyncAccountsParams): Observable<void>;
}
