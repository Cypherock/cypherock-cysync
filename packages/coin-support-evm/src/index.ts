/* eslint-disable class-methods-use-this */
import {
  CoinSupport,
  IReceiveEvent,
  IReceiveParams,
} from '@cypherock/coin-support-interfaces';
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

  public static setEthersLibrary(ethers: ethersLibType): void {
    setEthersLib(ethers);
  }
}
