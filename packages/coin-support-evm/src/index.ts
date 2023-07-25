/* eslint-disable class-methods-use-this */
import { CoinSupport } from '@cypherock/coin-support-interfaces';

import * as operations from './operations';
import { ICreateEvmAccountParams } from './operations/types';

export * from './operations/types';
export { updateLogger } from './utils/logger';

export class EvmSupport implements CoinSupport {
  public createAccounts(params: ICreateEvmAccountParams) {
    return operations.createAccounts(params);
  }

  public async syncAccounts() {
    throw new Error('Not implemented');
  }
}
