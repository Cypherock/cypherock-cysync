/* eslint-disable class-methods-use-this */
import * as operations from './operations';
import {
  IInheritanceEncryptMessageParams,
  IInheritanceWalletAuthParams,
} from './operations/types';

export * from './operations/types';
export { updateLogger } from './utils/logger';

export class InheritanceSupport {
  public walletAuth(params: IInheritanceWalletAuthParams) {
    return operations.walletAuth(params);
  }

  public encryptMessageWithPin(params: IInheritanceEncryptMessageParams) {
    return operations.encryptMessage(params);
  }
}
