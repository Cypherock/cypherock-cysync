import { Observable } from 'rxjs';

import { ICreateAccountEvent, ICreateAccountParams } from './createAccount';
import { IReceiveEvent, IReceiveParams } from './receive';

export * from './createAccount';
export * from './receive';
export * from './schemes';

export interface CoinSupport {
  createAccounts(params: ICreateAccountParams): Observable<ICreateAccountEvent>;
  receive(params: IReceiveParams): Observable<IReceiveEvent>;
}
