import { Observable } from 'rxjs';

import { ICreateAccountEvent, ICreateAccountParams } from './createAccount';
import { ISyncAccountsParams } from './syncAccount';

export * from './createAccount';
export * from './syncAccount';
export * from './schemes';

export interface CoinSupport {
  createAccounts(params: ICreateAccountParams): Observable<ICreateAccountEvent>;
  syncAccounts(params: ISyncAccountsParams): Observable<void>;
}
