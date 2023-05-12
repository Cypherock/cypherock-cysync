import { ICreateAccountParams } from './operations/createAccount/types';
import * as operations from './operations';

export * from './operations/types';
export { updateLogger } from './utils/logger';

export class EvmSupport {
  // eslint-disable-next-line class-methods-use-this
  public createAccounts(params: ICreateAccountParams) {
    return operations.createAccounts(params);
  }
}
