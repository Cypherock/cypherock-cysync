/* eslint-disable class-methods-use-this */
import * as operations from './operations';

export { updateLogger } from './utils/logger';

export * from './operations/types';

export class BuySellSupport {
  public getTradingPairs() {
    return operations.getTradingPairs();
  }
}
