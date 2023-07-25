/* eslint-disable class-methods-use-this */
import { CoinSupport } from '@cypherock/coin-support-interfaces';

import * as operations from './operations';
import { IBtcReceiveParams, ICreateBtcAccountParams } from './operations/types';

export * from './operations/types';
export { updateLogger } from './utils/logger';

export class BtcSupport implements CoinSupport {
  public createAccounts(params: ICreateBtcAccountParams) {
    return operations.createAccounts(params);
  }

  public receive(params: IBtcReceiveParams) {
    return operations.receive(params);
  }
}
