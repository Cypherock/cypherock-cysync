import { CoinSupport } from '@cypherock/coin-support-interfaces';

import * as operations from './operations';
import { ICreateBtcAccountParams } from './operations/types';

export * from './operations/types';
export { updateLogger } from './utils/logger';

export class BtcSupport implements CoinSupport {
  // eslint-disable-next-line class-methods-use-this
  public createAccounts(params: ICreateBtcAccountParams) {
    return operations.createAccounts(params);
  }
}
