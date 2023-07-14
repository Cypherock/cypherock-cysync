import { Observable } from 'rxjs';

import { ICreateAccountEvent, ICreateAccountParams } from './createAccount';

export * from './createAccount';
export * from './schemes';

export interface CoinSupport {
  createAccounts(params: ICreateAccountParams): Observable<ICreateAccountEvent>;
}
