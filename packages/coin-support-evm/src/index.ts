import { CoinSupport } from '@cypherock/coin-support-interfaces';

import * as operations from './operations';
import { ICreateEvmAccountParams } from './operations/types';

export * from './operations/types';
export { updateLogger } from './utils/logger';

export class EvmSupport implements CoinSupport {
  // eslint-disable-next-line class-methods-use-this
  public createAccounts(params: ICreateEvmAccountParams) {
    return operations.createAccounts(params);
  }
}
